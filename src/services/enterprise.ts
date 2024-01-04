import request from 'utils/fetch';

export const eventTrackingReport = (data: {
  event_detail?: string;
  event_type?: string;
  from_system?: string;
  level1_module?: string;
  level2_module?: string;
  level3_module?: string;
  path?: string;
  request_result?: any;
}) => request<{ id: number }>({ url: '/enterprise/common/event_tracking/report', method: 'post', data });

export const getInitialState = () =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/initial_state',
    method: 'get',
  });

export const getInsightTaskList = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/get_insight_task_list',
    method: 'post',
    data,
  });

export const exportTagConfig = () =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/export_tag_config',
    method: 'get',
  });

export const importTagConfig = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/import_tag_config',
    method: 'post',
    data,
  });

export const getCompanyByCreditNo = (data: any) =>
  request<{ company: string }>({
    url: '/enterprise/company/get_company_by_credit_no',
    method: 'post',
    data,
  });

export const decodeVerifyToken = (data: any) =>
  request<any>({
    url: '/enterprise/d_c_v_t',
    method: 'post',
    data,
  });

export const addEvent = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/event/add_event',
    method: 'post',
    data,
  });

export const editEvent = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/event/edit_event',
    method: 'post',
    data,
  });

export const startUserPackageInstanceDetailDataExcelDownload = (data: any) =>
  request<any>({
    url: '/enterprise/user_package/start_user_package_instance_detail_data_excel_download',
    method: 'post',
    data,
  });

export const getUserPackageInstanceDetailDataList = (data: any) =>
  request<any>({
    url: '/enterprise/user_package/get_user_package_instance_detail_data_list',
    method: 'post',
    data,
  });

export const getTagMetaList = (data: any) =>
  request<any>({
    url: '/enterprise/tag/get_tag_meta_list',
    method: 'post',
    data,
  });

export const getTableMetaData = (data: any) =>
  request<any>({
    url: '/enterprise/event/get_table_meta_data',
    method: 'post',
    data,
  });

export const addTag = (data: any) =>
  request<any>({
    url: '/enterprise/tag/add_tag',
    method: 'post',
    data,
  });

export const modifyEventStatus = (data: any) =>
  request<any>({
    url: '/enterprise/event/modify_event_status',
    method: 'post',
    data,
  });

export const editTag = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/edit_tag',
    method: 'post',
    data,
  });

export const getOrganizationForEnt = (name: string) =>
  request<any>({
    url: '/clue-tasks/get_organization_byname',
    method: 'get',
    params: { name },
  });

export const getInsightDataFieldDetail = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/get_insight_data_field_detail',
    method: 'post',
    data,
  });

export const getFtList = () =>
  request<any>({
    url: '/enterprise/common/ftSelect',
    method: 'get',
  });

export const editInsightTask = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/edit_insight_task',
    method: 'post',
    data,
  });

export const createInsightTask = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/create_insight_task',
    method: 'post',
    data,
  });

export const conditionInsight = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/condition_insight',
    method: 'post',
    data,
  });

export const deleteInsightTask = (data: any) =>
  request<{ common: { staffname: string; env: string; panshiAuthMap: any } }>({
    url: '/enterprise/tag/delete_insight_task',
    method: 'post',
    data,
  });

export const getCosTempToken = () =>
  request<{ Credentials: any; ExpiredTime: any }>({
    url: '/enterprise/user_package/tools/get_cos_temp_token',
    method: 'post',
  });

export const extractSqlInnerCustomer = (data: any) =>
  request<any>({
    url: '/enterprise/inner_sql_extract',
    method: 'post',
    data,
  });

export const getOpportunityList = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/get_opportunity_list',
    method: 'post',
    data,
  });

export const getCompanyWebsiteDomain = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/website_domain',
    method: 'post',
    data,
  });

export const getCompanyIspDns = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/isp_dns',
    method: 'post',
    data,
  });

export const getCompanyMobileApp = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/mobile_app',
    method: 'post',
    data,
  });

export const getCompanySdkService = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/sdk_service',
    method: 'post',
    data,
  });

export const getCompanyMobileProjectProduct = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/mobile_project_product',
    method: 'post',
    data,
  });

export const getCompanyWeChat = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/wechat',
    method: 'post',
    data,
  });

export const miniappProjectProduct = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/miniapp_project_product',
    method: 'post',
    data,
  });

export const getCompanyMainPerson = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/main_person',
    method: 'post',
    data,
  });

export const getCompanyMaimaiEmployee = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/maimai_employee',
    method: 'post',
    data,
  });

export const getCompanyPhoneMailAddress = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/phone_mail_address',
    method: 'post',
    data,
  });

export const getCompanyPatents = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/patents',
    method: 'post',
    data,
  });

export const getCompanyTrademarks = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/trademarks',
    method: 'post',
    data,
  });

export const getCompanyCertificates = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/certificates',
    method: 'post',
    data,
  });

export const getCompanySoftwareCopyright = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/software_copyright',
    method: 'post',
    data,
  });

export const getCompanyCopyrights = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/copyrights',
    method: 'post',
    data,
  });

export const getCompanyEntInfo = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/ent_info',
    method: 'post',
    data,
  });

export const getCompanyBranches = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/branches',
    method: 'post',
    data,
  });

export const getCompanyPartners = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/partners',
    method: 'post',
    data,
  });

export const getCompanyPayTaxes = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/pay_taxes',
    method: 'post',
    data,
  });

export const getCompanyChangeRecords = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/change_records',
    method: 'post',
    data,
  });

export const getCompanyInvestment = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/investment',
    method: 'post',
    data,
  });

export const getCompanyProjectFinance = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/project_finance',
    method: 'post',
    data,
  });

export const getCompanyNewJob = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/new_job',
    method: 'post',
    data,
  });

export const getCompanyBiddingData = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/bidding_data',
    method: 'post',
    data,
  });

export const getCompanyLicenseInfo = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/license_info',
    method: 'post',
    data,
  });

export const getCompanySimilarProject = (data: any) =>
  request<any>({
    url: '/enterprise/opportunity/console/company/similar_project',
    method: 'post',
    data,
  });

export const getFilterOptionAvailableValueList = () =>
  request<any>({ url: '/enterprise/opportunity/get_filter_option_available_value_list', method: 'get' });

export const getUserPackageTaskDetail = (data: { task_id: number }) =>
  request<any>({ url: '/enterprise/user_package/get_user_package_task_detail', method: 'post', data });

export const deleteUserPackageTask = (data: { task_id: number }) =>
  request<any>({ url: '/enterprise/user_package/delete_user_package_task', method: 'post', data });

export const createUserPackageTask = (data: any) =>
  request<any>({ url: '/enterprise/user_package/create_user_package_task', method: 'post', data });

export const editUserPackageTask = (data: any) =>
  request<any>({ url: '/enterprise/user_package/edit_user_package_task', method: 'post', data });

export const getTagAvailableValueOptionList = (data: any) =>
  request<any>({ url: '/enterprise/tag/get_tag_available_value_option_list', method: 'post', data });

export const getEventFieldOptionList = (data: any) =>
  request<any>({ url: '/enterprise/tag/get_event_field_option_list', method: 'post', data });

export const getEventDetailList = (data: any) =>
  request<any>({ url: '/enterprise/tag/get_event_detail_list', method: 'post', data });

export const editTemplateList = (data: any) =>
  request<any>({ url: '/enterprise/opportunity/console/template/edit_template', method: 'post', data });

export const addTemplateList = (data: any) =>
  request<any>({ url: '/enterprise/opportunity/console/template/add_template', method: 'post', data });

export const grts = (data: any) => request<any>({ url: '/enterprise/staff', method: 'post', data });

export const getUserPackageTaskInstanceList = (data: any) =>
  request<any>({ url: '/enterprise/user_package/get_user_package_task_instance_list', method: 'post', data });

export const getUserPackageInstanceDetailDataExcelDownloadUrl = (data: any) =>
  request<any>({
    url: '/enterprise/user_package/get_user_package_instance_detail_data_excel_download_url',
    method: 'post',
    data,
  });

export const getUserPackageInstanceDetailDataExcelAsyncDownloadUrl = (data: any) =>
  request<any>({
    url: '/enterprise/user_package/get_user_package_instance_detail_data_excel_async_download_url',
    method: 'post',
    data,
  });

export const getUserPackageTaskList = (data: any) =>
  request<any>({ url: '/enterprise/user_package/get_user_package_task_list', method: 'post', data });

export const extractInnerCustomer = (data: any) =>
  request<any>({ url: '/enterprise/extract_inner_custom', method: 'post', data });

export const getTemplateList = (data: any) =>
  request<any>({ url: '/enterprise/opportunity/console/template/get_template_list', method: 'post', data });

export const deleteTemplateList = (data: any) =>
  request<any>({ url: '/enterprise/opportunity/console/template/delete_template', method: 'post', data });

export const getEventList = (data: any) =>
  request<any>({ url: '/enterprise/tag/get_event_list', method: 'post', data });

export const getTagDirList = (data: any) =>
  request<any>({ url: '/enterprise/tag/get_tag_dir_list', method: 'post', data });
