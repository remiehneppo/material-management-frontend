import React from 'react';
import { Layout } from '../components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Package, Calculator, TrendingUp, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Tổng số vật tư',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      title: 'Dự án đang hoạt động',
      value: '23',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Calculator,
    },
    {
      title: 'Yêu cầu xuất hôm nay',
      value: '45',
      change: '-3%',
      changeType: 'negative' as const,
      icon: TrendingUp,
    },
    {
      title: 'Tổng giá trị xuất tháng này',
      value: '2.4B VND',
      change: '+18%',
      changeType: 'positive' as const,
      icon: FileText,
    },
  ];

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <span
                      className={`inline-flex items-center ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    {' '}so với tháng trước
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Tạo yêu cầu xuất vật tư',
                    material: 'Xi măng PCB40',
                    time: '2 phút trước',
                    user: 'Nguyễn Văn A',
                  },
                  {
                    action: 'Phê duyệt yêu cầu xuất',
                    material: 'Thép phi 12',
                    time: '15 phút trước',
                    user: 'Trần Thị B',
                  },
                  {
                    action: 'Thêm vật tư mới',
                    material: 'Cát xây dựng',
                    time: '1 giờ trước',
                    user: 'Lê Văn C',
                  },
                  {
                    action: 'Cập nhật dự toán',
                    material: 'Dự án ABC123',
                    time: '2 giờ trước',
                    user: 'Phạm Thị D',
                  },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}
                        {' '}<span className="font-medium">{activity.material}</span>
                      </p>
                      <p className="text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yêu cầu chờ phê duyệt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    requestId: 'REQ-001',
                    project: 'Dự án XYZ',
                    materials: 3,
                    requestedBy: 'Nguyễn Văn E',
                    date: '2024-08-27',
                  },
                  {
                    requestId: 'REQ-002',
                    project: 'Dự án ABC',
                    materials: 5,
                    requestedBy: 'Trần Thị F',
                    date: '2024-08-27',
                  },
                  {
                    requestId: 'REQ-003',
                    project: 'Dự án DEF',
                    materials: 2,
                    requestedBy: 'Lê Văn G',
                    date: '2024-08-26',
                  },
                ].map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{request.requestId}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          Chờ duyệt
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.project} • {request.materials} vật tư
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.requestedBy} • {request.date}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200 transition-colors">
                        Duyệt
                      </button>
                      <button className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors">
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
