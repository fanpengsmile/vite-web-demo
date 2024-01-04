import { lazy } from 'react';
import { IRouter } from '../index';
import {
  ServerIcon,
  SettingIcon,
  InternetIcon,
  SecuredIcon,
  RootListIcon,
  FileIcon,
  WalletIcon,
  LayersIcon,
  AttachIcon,
  BulletpointIcon,
  AppIcon,
  ChartPieIcon,
  ImageIcon,
  MenuUnfoldIcon,
} from 'tdesign-icons-react';

const enterpriseRoutes: IRouter[] = [
  {
    path: '/enterprise',
    meta: {
      title: '企业画像',
      Icon: ServerIcon,
    },
    children: [
      {
        path: 'opportunity/list',
        Component: lazy(() => import('pages/Enterprise/Opportunity/OpportunityList')),
        meta: {
          title: '全国企业查询',
          nav: 'opportunity/list',
          Icon: SettingIcon,
          need_pv_report: true,
          level1_module: '找企业',
          level2_module: '全国企业查询',
        },
      },
      {
        path: 'user_package',
        meta: {
          title: '分群创建',
          nav: 'user_package',
          Icon: SecuredIcon,
        },
        children: [
          {
            path: 'create',
            Component: lazy(() => import('pages/Enterprise/UserPackage/Edit/UserPackage')),
            meta: {
              title: '标签圈选',
              nav: 'create',
              Icon: RootListIcon,
              taskType: 'extract',
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群创建',
              level3_module: '标签圈选',
            },
          },
          {
            path: 'upload',
            Component: lazy(() => import('pages/Enterprise/UserPackage/FileUpload/Upload')),
            meta: {
              title: '文件导入',
              nav: 'upload',
              Icon: FileIcon,
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群创建',
              level3_module: '文件导入',
            },
          },
          {
            path: 'pkg_import',
            Component: lazy(() => import('pages/Enterprise/UserPackage/Edit/UserPackage')),
            meta: {
              title: '分群交并差',
              nav: 'pkg_import',
              Icon: LayersIcon,
              taskType: 'pkg_import',
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群创建',
              level3_module: '分群导入',
            },
          },
          {
            path: 'sql_import',
            Component: lazy(() => import('pages/Enterprise/UserPackage/SQLImport/SQLImport')),
            meta: {
              title: 'SQL创建',
              nav: 'sql_import',
              Icon: AttachIcon,
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群创建',
              level3_module: 'SQL导入',
            },
          },
        ],
      },
      {
        path: 'user_package_list',
        meta: {
          title: '分群管理',
          nav: 'user_package_list',
          Icon: InternetIcon,
        },
        children: [
          {
            path: 'list',
            Component: lazy(() => import('pages/Enterprise/UserPackage/List/List')),
            meta: {
              title: '分群列表',
              nav: 'list',
              Icon: BulletpointIcon,
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群管理',
            },
          },
          {
            path: 'template_list',
            Component: lazy(() => import('pages/Enterprise/UserPackage/TemplateList/TemplateList')),
            meta: {
              title: '模板列表',
              nav: 'template_list',
              Icon: AppIcon,
              need_pv_report: true,
              level1_module: '找企业',
              level2_module: '分群管理',
              level3_module: '分群模板',
            },
          },
        ],
      },
      {
        path: 'cluster_insight_list',
        Component: lazy(() => import('pages/Enterprise/ClusterInsight/List/List')),
        meta: {
          title: '分群洞察',
          nav: 'cluster_insight_list',
          Icon: ChartPieIcon,
          need_pv_report: true,
          level1_module: '找企业',
          level2_module: '分群画像',
        },
      },
    ],
  },
  {
    path: '/enterprise/portrait_meta',
    meta: {
      title: '画像资产',
      Icon: ImageIcon,
    },
    children: [
      {
        path: 'tag_dict/list',
        Component: lazy(() => import('pages/Enterprise/TagDict/List')),
        meta: {
          title: '标签字典',
          nav: 'tag_dict/list',
          Icon: MenuUnfoldIcon,
        },
      },
      {
        path: 'event_manage/list',
        Component: lazy(() => import('pages/Enterprise/EventManager/List')),
        meta: {
          title: '数据源管理',
          nav: 'event_manage/list',
          Icon: WalletIcon,
        },
      },
    ],
  },
  {
    path: '/enterprise/user_package/sql_import/:id',
    Component: lazy(() => import('pages/Enterprise/UserPackage/SQLImport/SQLImport')),
    meta: {
      taskType: 'sql_import',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/sql_import/detail/:id',
    Component: lazy(() => import('pages/Enterprise/UserPackage/SQLImport/SQLImport')),
    meta: {
      taskType: 'sql_import',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/detail/:id/customer_list/:instanceId/:dataType',
    Component: lazy(() => import('pages/Enterprise/UserPackage/Detail/CustomDetail')),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/enterprise/portrait_meta/event_manage/create',
    Component: lazy(() => import('pages/Enterprise/EventManager/Create/Create')),
    meta: {
      mode: 'create',
      hidden: true,
    },
  },
  {
    path: 'enterprise/portrait_meta/event_manage/detail/:eventId',
    Component: lazy(() => import('pages/Enterprise/EventManager/Create/Create')),
    meta: {
      mode: 'detail',
      hidden: true,
    },
  },
  {
    path: 'enterprise/portrait_meta/event_manage/edit/:eventId',
    Component: lazy(() => import('pages/Enterprise/EventManager/Create/Create')),
    meta: {
      mode: 'edit',
      hidden: true,
    },
  },
  {
    path: '/enterprise/portrait_meta/tag_dict/create',
    Component: lazy(() => import('pages/Enterprise/TagDict/Create/Create')),
    meta: {
      mode: 'create',
      hidden: true,
    },
  },
  {
    path: 'enterprise/portrait_meta/tag_dict/edit/:tagId/:tag_group',
    Component: lazy(() => import('pages/Enterprise/TagDict/Create/Create')),
    meta: {
      mode: 'edit',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/upload/:id',
    meta: {
      hidden: true,
    },
    Component: lazy(() => import('pages/Enterprise/UserPackage/FileUpload/Upload')),
  },
  {
    path: '/enterprise/user_package/edit/:id',
    Component: lazy(() => import('pages/Enterprise/UserPackage/Edit/UserPackage')),
    meta: {
      taskType: 'extract',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/pkg_import/:id',
    Component: lazy(() => import('pages/Enterprise/UserPackage/Edit/UserPackage')),
    meta: {
      taskType: 'pkg_import',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/cluster_insight_create',
    Component: lazy(() => import('pages/Enterprise/ClusterInsight/Cluster/Create')),
    meta: {
      need_pv_report: true,
      level1_module: '找企业',
      level2_module: '分群画像',
      level3_module: '创建画像',
      hidden: true,
    },
  },
  {
    path: '/enterprise/user_package/cluster_insight_edit/:id',
    Component: lazy(() => import('pages/Enterprise/ClusterInsight/Cluster/Create')),
    meta: {
      hidden: true,
    },
  },
  {
    path: 'enterprise/user_package/cluster_insight_detail/:id',
    Component: lazy(() => import('pages/Enterprise/ClusterInsight/Cluster/Create')),
    meta: {
      hidden: true,
    },
  },
  {
    path: 'enterprise/user_package/cluster_insight_copy/:id',
    Component: lazy(() => import('pages/Enterprise/ClusterInsight/Cluster/Create')),
    meta: {
      hidden: true,
    },
  },
  {
    path: 'enterprise/user_package/detail/:id',
    Component: lazy(() => import('pages/Enterprise/UserPackage/Detail/Detail')),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/enterprise/opportunity/item_detail',
    Component: lazy(() => import('pages/Enterprise/Opportunity/OpportunityItem')),
    meta: {
      hidden: true,
      need_pv_report: true,
      level1_module: '找企业',
      level2_module: '全国企业查询',
    },
  },
];

export default enterpriseRoutes;
