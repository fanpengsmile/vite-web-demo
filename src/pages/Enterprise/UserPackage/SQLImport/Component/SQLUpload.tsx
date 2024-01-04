/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Form, Card, Select, message } from 'antd';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import { FooterForm } from '../../Edit/Component/FooterForm';
import 'codemirror/theme/base16-light.css';
import 'codemirror/theme/yonce.css';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/css/css';
import 'codemirror/addon/hint/anyword-hint.js';
import {
  eventTrackingReport,
  extractSqlInnerCustomer,
  getUserPackageTaskDetail,
  createUserPackageTask,
  editUserPackageTask,
} from 'services/enterprise';
import moment from 'moment';
import { HistoryDetail, useHistoryDetail } from '../../Edit/Component/HistoryDetail/HistoryDetail';
import { useRequestGetUserPackageTaskDetail } from '../../../base/cgi';
import BaseInfo from './BaseInfo';
import { useNavigate } from 'react-router-dom';
import { get, delay } from 'lodash';

const themeOptions = [
  { label: '白色主题', value: 'base16-light' },
  { label: '黑色主题', value: 'yonce' },
];

function handleFieldsRelateToPeriodType({ periodType, periodEndDate, isDistinct, distinctDays, periodTime }: any) {
  const isPeriodTypeOnce = periodType === 'once';
  let todayDateStr;
  let currentTimeStr;
  if (isPeriodTypeOnce) {
    todayDateStr = moment().format('YYYY-MM-DD');
    currentTimeStr = moment().format('HH:mm:ss');
  } else {
    todayDateStr = moment().format('YYYY-MM-DD');
    currentTimeStr = periodTime ? periodTime.format('HH:mm:ss') : '10:30:00';
  }
  const periodDetail = isPeriodTypeOnce
    ? { beginDate: todayDateStr, periodTime: currentTimeStr }
    : {
        beginDate: todayDateStr,
        endDate: moment.isMoment(periodEndDate) ? periodEndDate.format('YYYY-MM-DD') : todayDateStr,
        periodTime: currentTimeStr,
      };

  return {
    periodDetail,
    partOfTypePara: isPeriodTypeOnce
      ? {
          is_distinct: 0,
          distinct_days: 0,
        }
      : {
          is_distinct: isDistinct ? 1 : 0,
          distinct_days: isDistinct ? distinctDays : 0,
        },
  };
}

function fieldsValueToSubmitData(fieldsValue: any, mode: string, content: string, taskId: number, staffname: string) {
  const {
    periodEndDate,
    is_distinct: isDistinct,
    distinct_days: distinctDays,
    period_type: periodType,
    period_time: periodTime,
    extract_out_limit_percent_check: limitCheck,
    task_expire_notify: notify,
    extract_error_or_zero_notify: zeroNotify,
    extract_out_limit_percent: limit,
    data_type,
    extract_limit_num,
  } = fieldsValue;
  const { periodDetail, partOfTypePara } = handleFieldsRelateToPeriodType({
    periodType,
    periodEndDate,
    isDistinct,
    distinctDays,
    periodTime,
  });
  let alertDetail;
  if (periodType === 'day') {
    alertDetail = {
      task_expire_notify: notify ? 1 : 0,
      extract_error_or_zero_notify: zeroNotify ? 1 : 0,
    };
    if (limitCheck) {
      // @ts-ignore
      alertDetail.extract_out_limit_percent = limit;
    }
  }
  const param = {
    creator: staffname,
    owner_list: get(fieldsValue, 'owner_list'),
    task_name: get(fieldsValue, 'task_name'),
    task_type: 'sql',
    period_detail: periodDetail,
    alert_detail: alertDetail,
    type_para: {
      ...partOfTypePara,
      sql: content,
      extract_limit_num,
    },
    data_type,
    period_type: get(fieldsValue, 'period_type'),
  };
  if (mode === 'edit') {
    // @ts-ignore
    param.task_id = taskId;
  }
  return param;
}

// @ts-ignore
function useSQLUpload(staffname, id, sqlContent) {
  const [content, setContent] = useState(sqlContent.uin);
  const [theme, setTheme] = useState('yonce');
  const [form] = Form.useForm();
  const [packageSize, setPackageSize] = useState(undefined);
  const [fieldsValue, setFieldsValue] = useState({
    period_type: 'once',
    creator: staffname,
    data_type: 'uin',
  });
  const { getUserPackageTaskDetailLoading, userPackageTaskDetail } = useRequestGetUserPackageTaskDetail({
    taskId: id,
    enable: true,
    onSuccess() {},
  });
  const historyDetailState = useHistoryDetail({ taskId: id });
  useEffect(() => {
    if (id) {
      getUserPackageTaskDetail({
        task_id: id,
      })
        .then((res) => {
          if (res[0]) {
            const data = get(res, '0');
            const {
              period_type: periodType,
              period_detail: periodDetail,
              alert_detail: alertDetail,
              type_para: typePara,
            } = data;
            setContent(get(data, 'type_para.sql'));
            const fields = {
              // creator: get(data, 'creator'),
              owner_list: get(data, 'owner_list'),
              task_name: get(data, 'task_name'),
              period_type: periodType,
              data_type: get(data, 'data_type'),
              period_time:
                periodType === 'once'
                  ? moment(`${periodDetail?.beginDate} ${periodDetail?.periodTime}`, 'YYYY-MM-DD HH:mm:ss')
                  : moment(periodDetail?.periodTime, 'HH:mm:ss'),
              periodEndDate: periodType === 'once' ? undefined : moment(get(periodDetail, 'endDate')),
              extract_error_or_zero_notify: get(alertDetail, 'extract_error_or_zero_notify', 0),
              extract_out_limit_percent_check: !!get(alertDetail, 'extract_out_limit_percent'),
              extract_out_limit_percent: get(alertDetail, 'extract_out_limit_percent'),
              is_distinct: typePara?.is_distinct,
              extract_limit_num: typePara?.extract_limit_num,
              distinct_days: typePara?.distinct_days,
              task_expire_notify: get(alertDetail, 'task_expire_notify', 0),
            };
            // @ts-ignore
            setFieldsValue(fields);
            form.setFieldsValue(fields);
          } else {
            message.error(get(res, 'returnMessage', '获取详情失败'));
          }
        })
        .catch((e) => {
          message.error(get(e, 'returnMessage', '获取详情失败'));
        });
    }
  }, [id]);
  return {
    content,
    setPackageSize,
    setContent,
    form,
    setFieldsValue,
    fieldsValue,
    theme,
    setTheme,
    packageSize,
    historyDetailState,
    userPackageTaskDetail,
    getUserPackageTaskDetailLoading,
  };
}

function SQLUpload({ modeStr, staffname, isDetail, mode, id, common }: any) {
  const sqlContent = {
    uin: `--如何创建SQL分群，帮助信息
select 
    groupBitmapState(toUInt32(sid))  --select只能有一个字段，且命名必须是sid
from 
    opc_tag.ads_inner_uin_sid_tag_df  --库表名
where 
    ftime = toString(toYYYYMMDD(addDays(today(), -2)))  --库表分区时间
    and property = '企业' 	 
    and authtime = '20230821'`,
    phone: `select 
    phone_num 
as 
    phone 
from
    opc_tag.dwd_ccc_new_demo_df 
where imp_date = toString(toYYYYMMDD(addDays(today(), -1)))`,
  };
  const {
    content,
    setPackageSize,
    setContent,
    form,
    setFieldsValue,
    fieldsValue,
    theme,
    setTheme,
    packageSize,
    historyDetailState,
    userPackageTaskDetail,
  } = useSQLUpload(staffname, id, sqlContent);
  const navigate = useNavigate();
  const fetchPackageSize = async () => {
    try {
      const [res, err] = await extractSqlInnerCustomer({
        data_type: fieldsValue.data_type,
        is_show_data_detail: 0,
        sql: content,
      });
      if (res) {
        setPackageSize(get(res, 'total'));
      }
      if (err) {
        message.error(err.message);
      }
    } catch (error) {
      message.error(get(error, 'returnMessage', '预估人数获取失败'));
    }
  };
  // @ts-ignore
  const onChange = (editor, data, value) => {
    setContent(value);
    setPackageSize(undefined);
  };
  const afterSuccessCreateOrEdit = () => {
    message.success(`已${modeStr}分群`);
    delay(() => {
      navigate(`/enterprise/user_package_list/list`);
    }, 1000);
  };
  // @ts-ignore
  const submit = async (content, staffname) => {
    let fied;
    try {
      fied = await form.validateFields(); // 校验当前表单，注意这是个异步的过程，需要使用await
    } catch (e) {
      message.warning('当前表单校验失败，请检查后重新提交');
      return;
    }
    const submitData = fieldsValueToSubmitData(fied, mode, content, id, staffname);
    if (mode === 'create' || mode === 'copy') {
      // @ts-ignore
      eventTrackingReport({
        event_type: 'button',
        event_detail: '创建分群',
        from_system: window.top === window.self ? '商机' : '其他',
      });
    }
    try {
      let res;
      if (mode === 'create' || mode === 'copy') {
        res = await createUserPackageTask(submitData);
      } else {
        res = await editUserPackageTask(submitData);
      }
      if (res[0]) {
        afterSuccessCreateOrEdit();
      } else {
        message.error(get(res, 'returnMessage', `${modeStr}分群失败`));
      }
    } catch (error) {
      message.error(get(error, 'returnMessage', `${modeStr}分群失败`));
    }
  };

  return (
    <div style={{ minWidth: 1400 }}>
      <Form
        onValuesChange={(v) => {
          if (get(v, 'data_type') === 'uin') {
            setContent(sqlContent.uin);
          } else if (get(v, 'data_type') === 'phone') {
            setContent(sqlContent.phone);
          }
          setFieldsValue({
            ...fieldsValue,
            ...v,
          });
        }}
        initialValues={fieldsValue}
        form={form}
      >
        <BaseInfo isDetail={isDetail} staffname={staffname}></BaseInfo>
        <Card
          style={{ marginTop: '20px', marginBottom: '20px' }}
          extra={
            <>
              <span>编辑器主题：</span>
              <Select
                size='small'
                value={theme}
                onChange={(v) => {
                  setTheme(v);
                }}
                style={{ width: '130px' }}
                options={themeOptions}
              ></Select>
            </>
          }
          title={
            <>
              执行脚本
              <span style={{ fontSize: '11px', color: 'gray', marginLeft: '10px' }}>使用Ctrl键自动补全关键字</span>
            </>
          }
        >
          <CodeMirror
            value={content}
            onChange={onChange}
            options={{
              mode: 'sql', // 定义mode
              autofocus: true, // 自动获取焦点
              styleActiveLine: true, // 光标代码高亮
              lineNumbers: true, // 显示行号
              theme,
              smartIndent: true, // 自动缩进
              // start-设置支持代码折叠
              lineWrapping: true,
              foldGutter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // end
              extraKeys: {
                Ctrl: 'autocomplete',
              },
              matchBrackets: true, // 括号匹配，光标旁边的括号都高亮显示
              autoCloseBrackets: true, // 键入时将自动关闭()[]{}''""
            }}
          />
        </Card>
        {isDetail ? null : (
          <FooterForm
            modeStr={modeStr}
            onSubmit={() => {
              submit(content, staffname);
            }}
            predictUserPackageSizeState={{
              packageSize,
            }}
            showTemplate={false}
            onPredictUserPackageSize={fetchPackageSize}
            mode={mode}
            dataType={fieldsValue.data_type}
            showPredictUserPackageSize={true}
          ></FooterForm>
        )}
      </Form>
      {isDetail ? (
        <HistoryDetail
          taskId={id}
          common={common}
          isSqlType={true}
          dataType={fieldsValue.data_type}
          userPackageTaskDetail={userPackageTaskDetail}
          {...historyDetailState}
        />
      ) : null}
    </div>
  );
}

export default SQLUpload;
