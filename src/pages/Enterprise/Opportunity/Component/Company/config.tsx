import React from 'react';
import { Modal, Descriptions, Tooltip } from 'antd';
import { get, find } from 'lodash';
import moment from 'moment';
import {
  getCompanyWebsiteDomain,
  getCompanyIspDns,
  getCompanyMobileApp,
  getCompanySdkService,
  getCompanyMobileProjectProduct,
  getCompanyWeChat,
  miniappProjectProduct,
  getCompanyMainPerson,
  getCompanyMaimaiEmployee,
  getCompanyPhoneMailAddress,
  getCompanyPatents,
  getCompanyTrademarks,
  getCompanyCertificates,
  getCompanySoftwareCopyright,
  getCompanyCopyrights,
  getCompanyEntInfo,
  getCompanyBranches,
  getCompanyPartners,
  getCompanyPayTaxes,
  getCompanyChangeRecords,
  getCompanyInvestment,
  getCompanyProjectFinance,
  getCompanyNewJob,
  getCompanyBiddingData,
  getCompanyLicenseInfo,
  getCompanySimilarProject,
} from 'services/enterprise';
// config 配置文件，可以配置一些无状态的UI组件，不要在文件中保存状态

export interface IBaseCompanyDetailProps {
  name: string;
  isShow: boolean;
  show: boolean;
  fold: boolean;
  desensitize?: boolean;
}

export interface ICompanyDetailProps {
  name: string;
  show: boolean;
  entInfo: {};
  desensitize?: boolean;
}

export interface ICompanyDetailComponent {
  name: string;
  isShow: boolean;
  show: boolean;
  defaultSelectValue: string;
  fetchList: any[];
  config: any;
  elementId: string;
  fold: boolean;
  desensitize?: boolean;
}

function showEllipsisDetail(v: string) {
  return (
    <>
      <Tooltip style={{ width: '400px' }} placement='leftTop' title={v}>
        <span>{v.length > 100 ? `${v.substring(0, 100)}...` : v}</span>
      </Tooltip>
    </>
  );
}

const itemStyle = {
  labelStyle: { width: '10%' },
  contentStyle: { width: '23%' },
};

function showDetail(text: string, record: any, config: any, title: string) {
  return (
    <a
      onClick={() => {
        Modal.info({
          content: (
            <Descriptions column={1} bordered>
              {config.map((item: any) => (
                <Descriptions.Item style={{ width: '200px' }} key={item.dataIndex} label={item.title} {...itemStyle}>
                  {get(record, item.dataIndex, '-')}
                </Descriptions.Item>
              ))}
            </Descriptions>
          ),
          title,
          width: '800px',
        });
      }}
    >
      详情
    </a>
  );
}

const trademarksDeatil = [
  { dataIndex: 'start_date', title: '专用期限-开始日期' },
  { dataIndex: 'end_date', title: '专用期限-截止日期' },
  { dataIndex: 'agent', title: '代理人' },
  { dataIndex: 'image_url', title: '商标Logo' },
  { dataIndex: 'address_cn', title: '申请人地址' },
];

const patentdetail = [
  { dataIndex: 'patent_person', title: '申请人' },
  { dataIndex: 'designer', title: '发明人' },
  { dataIndex: 'category_num', title: '分类号' },
  { dataIndex: 'agent', title: '专利代理机构' },
  { dataIndex: 'agent_people', title: '代理人' },
];

const newJobDetail = [
  { dataIndex: 'source', title: '招聘平台' },
  { dataIndex: 'number', title: '招聘人数' },
  { dataIndex: 'welfare', title: '福利' },
  { dataIndex: 'position', title: '位置' },
  { dataIndex: 'start_date', title: '招聘开始日期' },
  { dataIndex: 'end_date', title: '招聘截止日期' },
  { dataIndex: 'job_1st_class', title: '工作一级分类' },
  { dataIndex: 'job_2nd_class', title: '工作二级分类' },
  { dataIndex: 'job_3rd_class', title: '工作三级分类' },
  { dataIndex: 'job_4th_class', title: '工作四级分类' },
  {
    dataIndex: 'description',
    title: '职位描述',
    ellipsis: true,
    render: showEllipsisDetail,
  },
];

export const ProductServiceConfig = [
  {
    label: '网站域名',
    value: 'webDomain',
    fetch: getCompanyWebsiteDomain,
    columns: [
      { dataIndex: 'home_url', title: '网址' },
      { dataIndex: 'site_name', title: '网站名称' },
      { dataIndex: 'domain', title: '域名' },
      { dataIndex: 'number', title: '备案许可证号' },
      { dataIndex: 'check_date', title: '审核时间' },
      { dataIndex: 'created_time', title: '创建时间' },
    ],
  },
  {
    value: 'ispDns',
    label: '云服务商',
    fetch: getCompanyIspDns,
    option: [
      { value: 'isp', label: '使用的云厂商' },
      { value: 'domain_req_cnt', label: '域名热度' },
    ],
  },
  {
    label: 'APP开发',
    value: 'mobileApp',
    fetch: getCompanyMobileApp,
    columns: [
      { dataIndex: 'app_name', title: '应用名称', with: 150 },
      { dataIndex: 'app_channel', title: '下载渠道' },
      { dataIndex: 'app_category', title: '应用分类' },
      { dataIndex: 'app_latest_version', title: '最新版本' },
      { dataIndex: 'app_platform', title: '应用平台' },
      { dataIndex: 'sdk_developer_title', title: 'sdk服务商名称' },
      { dataIndex: 'sdk_name', title: 'sdk名称' },
      { dataIndex: 'sdk_category', title: 'sdk分类' },
    ],
  },
  {
    label: 'SDK开发',
    value: 'sdk',
    fetch: getCompanySdkService,
    columns: [
      { dataIndex: 'pkg_id', title: '包ID', width: 200 },
      { dataIndex: 'name', title: 'SDK名称', width: 200 },
      { dataIndex: 'category', title: 'SDK类别', width: 200 },
      { dataIndex: 'platform', title: 'SDK平台', width: 200 },
    ],
  },
  {
    value: 'mobileProject',
    label: '移动项目',
    fetch: getCompanyMobileProjectProduct,
    columns: [
      { dataIndex: 'kind', title: '产品类型' },
      { dataIndex: 'name', title: '产品名称' },
      {
        dataIndex: 'description',
        title: '产品描述',
        ellipsis: true,
        width: 600,
        render: showEllipsisDetail,
      },
      {
        dataIndex: 'links',
        title: 'links',
        windth: 300,
        ellipsis: true,
        render: showEllipsisDetail,
      },
      { dataIndex: 'domain', title: 'domain' },
      { dataIndex: 'create_time', title: '创建时间' },
    ],
  },
  {
    value: 'weChat',
    label: '公众号',
    fetch: getCompanyWeChat,
    columns: [
      { dataIndex: 'title', title: '名称' },
      { dataIndex: 'public_num', title: '微信号' },
      {
        dataIndex: 'create_time',
        title: '创建时间',
        render: (v: string) => {
          return moment(v).format('YYYY-MM-DD');
        },
      },
      { dataIndex: 'img_url', title: '公众号标题图片URL' },
    ],
  },
  {
    value: 'weChatProject',
    label: '小程序',
    fetch: miniappProjectProduct,
    columns: [
      // { dataIndex: 'kind', title: '产品类型' },
      { dataIndex: 'name', title: '产品名称' },
      { dataIndex: 'description', title: '产品描述' },
      { dataIndex: 'links', title: 'links' },
      { dataIndex: 'domain', title: 'domain' },
      { dataIndex: 'create_time', title: '创建时间' },
    ],
  },
];

const marksList = [
  { value: '1', label: '化学原料' },
  { value: '2', label: '颜料油漆' },
  { value: '3', label: '日化用品' },
  { value: '4', label: '燃料油脂' },
  { value: '5', label: '医药' },
  { value: '6', label: '金属材料' },
  { value: '7', label: '机械设备' },
  { value: '8', label: '手工器械' },
  { value: '9', label: '科学仪器' },
  { value: '10', label: '医疗器械' },
  { value: '11', label: '灯具空调' },
  { value: '12', label: '运输工具' },
  { value: '13', label: '军火烟火' },
  { value: '14', label: '珠宝钟表' },
  { value: '15', label: '乐器' },
  { value: '16', label: '办公用品' },
  { value: '17', label: '橡胶制品' },
  { value: '18', label: '皮革皮具' },
  { value: '19', label: '建筑材料' },
  { value: '20', label: '家具' },
  { value: '21', label: '厨房洁具' },
  { value: '22', label: '绳网袋蓬' },
  { value: '23', label: '纱线丝' },
  { value: '24', label: '布料床单' },
  { value: '25', label: '服装鞋帽' },
  { value: '26', label: '钮扣拉链' },
  { value: '27', label: '地毯席垫' },
  { value: '28', label: '健身器材' },
  { value: '29', label: '食品' },
  { value: '30', label: '方便食品' },
  { value: '31', label: '饲料种籽' },
  { value: '32', label: '啤酒饮料' },
  { value: '33', label: '酒' },
  { value: '34', label: '烟草烟具' },
  { value: '35', label: '广告销售' },
  { value: '36', label: '金融物管' },
  { value: '37', label: '建筑修理' },
  { value: '38', label: '通讯服务' },
  { value: '39', label: '运输贮藏' },
  { value: '40', label: '材料加工' },
  { value: '41', label: '教育娱乐' },
  { value: '42', label: '科技服务' },
  { value: '43', label: '餐饮住宿' },
  { value: '44', label: '医疗园艺' },
  { value: '45', label: '社会服务' },
];

export const EnterprisePersonnelConfig = [
  {
    value: 'main_person',
    label: '主要人员',
    fetch: getCompanyMainPerson,
    columns: [
      { dataIndex: 'job_title', title: '职位' },
      { dataIndex: 'person_name', title: '人员姓名' },
      { dataIndex: 'stock_percent', title: '股票比例' },
      { dataIndex: 'name_type', title: '人员类型' },
      { dataIndex: 'update_time', title: '更新时间' },
    ],
  },
  {
    value: 'maimai_employee',
    label: '员工人脉',
    fetch: getCompanyMaimaiEmployee,
    columns: [
      { dataIndex: 'company_name', title: '当前所在公司' },
      { dataIndex: 'name', title: '姓名' },
      { dataIndex: 'gender', title: '性别' },
      { dataIndex: 'avatar', title: '头像链接' },
      { dataIndex: 'position', title: '岗位' },
      { dataIndex: 'address', title: '地点' },
      { dataIndex: 'line4', title: '岗位类型和影响力' },
    ],
  },
  {
    value: 'phone_mail_address',
    label: '电话邮箱地址',
    fetch: getCompanyPhoneMailAddress,
    columns: [
      { dataIndex: 'telephone', title: '电话', desensitize: true },
      { dataIndex: 'email', title: '邮箱' },
      { dataIndex: 'address', title: '地址' },
    ],
  },
];

export const IntellectualPropertyConfig = [
  {
    value: 'patents',
    label: '专利信息',
    fetch: getCompanyPatents,
    columns: [
      { dataIndex: 'patent_name', title: '专利名称' },
      { dataIndex: 'type_name', title: '专利类型' },
      { dataIndex: 'request_num', title: '申请公布号' },
      { dataIndex: 'request_date', title: '公布日期' },
      {
        dataIndex: 'brief',
        title: '专利摘要',
        ellipsis: true,
        render: showEllipsisDetail,
      },
      {
        dataIndex: 'detail',
        title: '详情',
        width: 100,
        render: (text: string, record: any) => {
          return showDetail(text, record, patentdetail, get(record, 'patent_name'));
        },
      },
    ],
  },
  {
    value: 'trademarks',
    label: '商标信息',
    fetch: getCompanyTrademarks,
    columns: [
      {
        dataIndex: 'image_url',
        title: '商标',
        render: (v: string) => <img style={{ width: '50px', height: '50px' }} src={v} />,
      },
      { dataIndex: 'name', title: '商标名称' },
      {
        dataIndex: 'type_num',
        title: '商标类型',
        render: (v: string) => get(find(marksList, { value: v }), 'label'),
        width: 100,
      },
      { dataIndex: 'reg_number', title: '注册号', width: 150 },
      { dataIndex: 'apply_date', title: '申请日期' },
      { dataIndex: 'status', title: '商标状态' },
      {
        dataIndex: 'detail',
        title: '详情',
        width: 100,
        render: (text: string, record: any) => {
          return showDetail(text, record, trademarksDeatil, get(record, 'name'));
        },
      },
    ],
  },
  {
    value: 'certificates',
    label: '资质证书',
    fetch: getCompanyCertificates,
    columns: [
      { dataIndex: 'type', title: '证书类型' },
      { dataIndex: 'state', title: '证书状态' },
      { dataIndex: 'register_no', title: '证书编号' },
      { dataIndex: 'unit_main', title: '产品名称及单元(主)' },
      { dataIndex: 'valid_start', title: '发证日期' },
      { dataIndex: 'valid_end', title: '截止日期' },
      { dataIndex: 'issue_unit', title: '发证机构' },
    ],
  },
  {
    value: 'software_copyright',
    label: '软件著作权',
    fetch: getCompanySoftwareCopyright,
    columns: [
      // { dataIndex: 'ename', title: '企业名称' },
      { dataIndex: 'name', title: '软件全称' },
      { dataIndex: 'short_name', title: '软件简称' },
      // { dataIndex: 'type_name', title: '作品类别' },
      { dataIndex: 'first_date', title: '首次发表日期' },
      { dataIndex: 'approval_date', title: '登记批准日期' },
      { dataIndex: 'number', title: '登记号' },
      { dataIndex: 'version', title: '版本号' },
    ],
  },
  {
    value: 'copyrights',
    label: '作品著作权',
    fetch: getCompanyCopyrights,
    columns: [
      { dataIndex: 'name', title: '作品全称' },
      { dataIndex: 'type_name', title: '作品类别' },
      { dataIndex: 'success_date', title: '创作完成日期' },
      { dataIndex: 'approval_date', title: '登记批准日期' },
      { dataIndex: 'first_date', title: '首次发表日期' },
      { dataIndex: 'number', title: '登记号' },
    ],
  },
];

export const BasicInformationConfig = [
  {
    value: 'ent_info',
    label: '工商信息',
    fetch: getCompanyEntInfo,
    resValue: 'ent_info',
    descriptionsColumn: 2,
    option: [
      { value: 'oper_name', label: '企业法人' },
      { value: 'start_date', label: '成立时间' },
      { value: ['province', 'city', 'district'], label: '地域' },
      {
        value: ['first_industry', 'second_industry', 'third_industry', 'fourth_industry'],
        label: '所属行业',
      },
      { value: 'regist_capi', label: '注册资本' },
      { value: 'collegues_num_level', label: '人员规模' },
      { value: 'actual_capi', label: '实收资本' },
      { value: 'collegues_num', label: '参保人数' },
      { value: 'reg_no', label: '注册号' },
      { value: 'belong_org', label: '登记机关' },
      { value: 'org_no', label: '组织机构代码' },
      { value: 'check_date', label: '核准日期' },
      { value: 'credit_no', label: '社会信用代码' },
      { value: ['term_start', 'term_end'], label: '经营期限' },
      { value: 'address', label: '企业地址', span: 4 },
      { value: 'scope', label: '经营范围', span: 4 },
      { value: 'brief_content', label: '企业简介', span: 4 },
      // { value: 'name', label: '企业名称' },
      // { value: 'status', label: '企业状态' },
      // { value: 'econ_kind', label: '企业类型' },
      // { value: 'start_date', label: '成立时间' },
      // { value: 'home_url', label: '企业官网' },
      // { value: 'first_industry', label: '国标行业一级' },
      // { value: 'second_industry', label: '国标行业二级' },
      // { value: 'is_high_tech_certification', label: '高新技术企业' },
      // { value: 'is_high_tech', label: '专精特新' },
      // { value: 'is_sdk', label: 'SDK服务商' },
      // { value: 'is_app', label: 'App开发商' },
      // { value: 'is_copyrights', label: '软件著作权' },
      // { value: 'ipo', label: '上市类型' },
      // { value: 'oper_name', label: '企业法人' },
      // { value: 'province', label: '省份' },
      // { value: 'city', label: '城市' },
      // { value: 'district', label: '区县' },
      // { value: 'regist_capi', label: '注册资本' },
      // { value: 'actual_capi', label: '实收资本' },
      // { value: 'address', label: '企业地址' },
      // { value: 'collegues_num', label: '参保人数' },
      // { value: 'collegues_num_level', label: '人员规模' },
      // { value: 'reg_no', label: '注册号' },
      // { value: 'org_no', label: '组织机构代码' },
      // { value: 'credit_no', label: '社会信用代码' },
      // { value: 'belong_org', label: '登记机关' },
      // { value: 'check_date', label: '核准日期' },
      // { value: 'term_start', label: '经营期限起始日期' },
      // { value: 'term_end', label: '经营期限结束日期' },
      // { value: 'cust_sales_channel_name', label: '销售通路一级' },
      // { value: 'cust_sales_channel2_name', label: '销售通路二级' },
      // { value: 'customer_business_manager', label: '主销售' },
      // { value: 'manager_type', label: '销售类型' },
      // { value: 'cid_first_time_shouldincome', label: '首次收入日期' },
      // { value: 'cid_avg_consume_recnet3mon_level', label: '消耗级别' },
      // { value: 'cid_avg_income_recnet3mon_level', label: '收入级别' },
      // { value: 'shouldincome_level', label: '收入TC层级' },
      // { value: 'product_list_3mon', label: '近3个月使用产品' },
      // { value: 'first_create_time', label: '首次注册时间' },
      // { value: 'first_authtime', label: '首次认证时间' },
      // { value: 'uin_cid_num', label: '认证账号数' },
      // { value: 'industry_name', label: '收入行业一级' },
      // { value: 'sub_industry_name', label: '收入行业二级' },
      // { value: 'isp', label: '云服务商', span: 3 },
      // { value: 'scope', label: '经营范围', span: 3 },
      // { value: 'brief_content', label: '企业简介', span: 3 },
    ],
  },
  {
    label: '子公司和分支机构',
    value: 'branches',
    fetch: getCompanyBranches,
    columns: [
      { dataIndex: 'sub_name', title: '分支机构名称' },
      { dataIndex: 'oper_name', title: '法定代表人' },
      { dataIndex: 'start_date', title: '成立时间' },
      { dataIndex: 'first_industry', title: '国标行业一级' },
      { dataIndex: 'second_industry', title: '国标行业二级' },
      { dataIndex: 'regist_capi', title: '注册资本' },
    ],
  },
  {
    label: '股东信息',
    value: 'partners',
    fetch: getCompanyPartners,
    columns: [
      { dataIndex: 'stock_name', title: '股东名称' },
      { dataIndex: 'stock_type', title: '股东类型' },
      {
        dataIndex: 'stock_percent',
        title: '持股比例',
      },
      {
        dataIndex: 'total_should_capi',
        title: '认缴出资额',
        render: (v: string) => v || '-',
      },
      {
        dataIndex: 'total_real_capi',
        title: '实缴出资额',
        render: (v: string) => v || '-',
      },
    ],
  },
  {
    label: '税务评级',
    value: 'pay_taxes',
    fetch: getCompanyPayTaxes,
    columns: [
      { dataIndex: 'name', title: '纳税人名称' },
      { dataIndex: 'year', title: '纳税A级年份' },
      { dataIndex: 'number', title: '纳税人识别号' },
      { dataIndex: 'credit_level', title: '信用评级' },
    ],
  },
  {
    label: '工商变更',
    value: 'change_records',
    fetch: getCompanyChangeRecords,
    columns: [
      { dataIndex: 'change_date', title: '变更日期', width: 150 },
      { dataIndex: 'change_item', title: '变更项目名称', width: 200 },
      { dataIndex: 'type', title: '变更分类', width: 200 },
      {
        dataIndex: 'before_content',
        title: '变更前',
        ellipsis: true,
        render: showEllipsisDetail,
      },
      {
        dataIndex: 'after_content',
        title: '变更后',
        ellipsis: true,
        render: showEllipsisDetail,
      },
    ],
  },
];

export const DevelopmentManagementConfig = [
  {
    label: '对外投资',
    value: 'investment',
    fetch: getCompanyInvestment,
    columns: [
      { dataIndex: 'invest_name', title: '被投公司名称' },
      { dataIndex: 'invest_oper_name', title: '被投公司法人' },
      { dataIndex: 'invest_start_date', title: '被投公司成立日期' },
      { dataIndex: 'invest_regist_capi', title: '被投公司注册资本' },
      {
        dataIndex: 'stock_percentage',
        title: '股本',
        render: (v: number) => `${(v * 100).toFixed(2)}%`,
      },
      { dataIndex: 'should_capi', title: '应交额' },
    ],
  },
  {
    label: '融资历史',
    value: 'project_finance',
    fetch: getCompanyProjectFinance,
    columns: [
      { dataIndex: 'date', title: '融资日期' },
      { dataIndex: 'round', title: '融资轮次' },
      { dataIndex: 'amount', title: '融资金额' },
      { dataIndex: 'currency', title: '金额单位' },
      { dataIndex: 'investors', title: '投资方' },
      { dataIndex: 'publish_date', title: '发布日期' },
    ],
  },
  {
    label: '招聘信息',
    value: 'new_job',
    fetch: getCompanyNewJob,
    columns: [
      { dataIndex: 'title_abbr', title: '职位名称' },
      { dataIndex: 'salary', title: '薪资待遇' },
      { dataIndex: 'years', title: '工作经验' },
      { dataIndex: 'education', title: '学历要求' },
      { dataIndex: 'location', title: '工作地点' },
      { dataIndex: 'date', title: '发布日期' },
      {
        dataIndex: 'detail',
        title: '详情',
        width: 100,
        render: (text: string, record: any) => {
          return showDetail(text, record, newJobDetail, get(record, 'title_abbr'));
        },
      },
    ],
  },
  {
    label: '招标投标',
    value: 'bidding_data',
    fetch: getCompanyBiddingData,
    columns: [
      { dataIndex: 'eid', title: '企业eid' },
      { dataIndex: 'title', title: '项目名称' },
      { dataIndex: 'tender_agent', title: '招标代理' },
      { dataIndex: 'proj_num', title: '工程号/采购编号' },
      { dataIndex: 'result_corps', title: '中标人' },
      { dataIndex: 'tender_corpnames', title: '招标公司/采购单位' },
      { dataIndex: 'area_name', title: '所属地区' },
      { dataIndex: 'date', title: '发布日期' },
    ],
  },
  {
    label: '行政许可',
    value: 'license_info',
    fetch: getCompanyLicenseInfo,
    columns: [
      { dataIndex: 'license_name', title: '文件名称' },
      { dataIndex: 'number', title: '文件编号' },
      {
        dataIndex: 'end_date',
        title: '有效期',
        render: (v: string, record: any) => {
          // eslint-disable-next-line camelcase
          const { start_date } = record;
          // eslint-disable-next-line camelcase
          return `${start_date}-${v}`;
        },
      },
      { dataIndex: 'department', title: '许可机关' },
      { dataIndex: 'content', title: '许可内容' },
      { dataIndex: 'status', title: '状态' },
      // { dataIndex: 'license_category', title: '许可文件类型' },
      // { dataIndex: 'number', title: '许可文件编号' },
      // { dataIndex: 'start_date', title: '发证日期' },
      // { dataIndex: 'end_date', title: '到期日期' },
    ],
  },
  {
    label: '竞品友商',
    value: 'similar_project',
    fetch: getCompanySimilarProject,
    columns: [
      { dataIndex: 'sim_ename', title: '竞品所属企业名称', width: 200 },
      { dataIndex: 'name', title: '竞品名称', width: 100 },
      { dataIndex: 'brief', title: '竞品简介', width: 200 },
      { dataIndex: 'round', title: '竞品轮次', width: 100 },
      { dataIndex: 'description', title: '竞品描述' },
    ],
  },
];

export const baseInfoConfig = [
  { value: 'start_date', label: '公司成立时间' },
  // { value: 'first_create_time', label: '首次注册时间' },
  { value: 'first_authtime', label: '首次认证时间' },
  { value: 'uin_cid_num', label: '认证账号数' },
  { value: 'cid_first_time_shouldincome', label: '首次应收日期' },
  { value: ['industry_name', 'sub_industry_name'], label: '收入行业' },
  {
    value: ['cust_sales_channel_name', 'cust_sales_channel2_name'],
    label: '销售通路',
  },
  { value: 'customer_business_manager', label: '主销售' },
  { value: 'manager_type', label: '销售类型' },
  {
    value: 'cid_avg_consume_recnet3mon_level',
    label: '消耗级别',
    descrition: 'CID维度下近3个月平均月消耗，计算层级',
  },
  {
    value: 'cid_avg_income_recnet3mon_level',
    label: '收入级别',
    descrition: 'CID维度下近3个月平均月应收，计算层级',
  },
  {
    value: 'shouldincome_level',
    label: 'CID收入TC层级',
    descrition: 'CID近12个月收入TC层级',
  },
  { value: ['province', 'city', 'district'], label: '所在地域' },
  { value: 'home_url', label: '企业官网' },
  {
    value: 'isp',
    label: '云服务商',
    span: 3,
    descrition: '根据企业备案域名解析数据判断服务商归属',
  },
  {
    value: ['first_industry', 'second_industry', 'third_industry', 'fourth_industry'],
    label: '国标行业',
    span: 4,
  },
  {
    value: 'product_list_3mon',
    label: '近3个月使用产品',
    span: 4,
    descrition: '企业CID在近3个月的时间内，有产品应收的计费商品码名称',
  },
];
