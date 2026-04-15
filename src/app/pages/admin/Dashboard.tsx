import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, FileText, Video, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { students, content, videos } = useData();

  const activeStudents = students.filter(s => s.status === 'active').length;

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: Users,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Active Students',
      value: activeStudents,
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: '+5%',
    },
    {
      title: 'Content Items',
      value: content.length,
      icon: FileText,
      color: 'bg-indigo-500',
      trend: '+8%',
    },
    {
      title: 'Video Courses',
      value: videos.length,
      icon: Video,
      color: 'bg-purple-500',
      trend: '+3%',
    },
  ];

  const recentActivity = [
    { action: 'New student enrolled', student: 'Sarah Williams', time: '2 hours ago' },
    { action: 'Content uploaded', student: 'Admin', time: '5 hours ago' },
    { action: 'Video published', student: 'Admin', time: '1 day ago' },
    { action: 'Student profile updated', student: 'John Doe', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600 mt-1">Monitor your portal's key metrics and activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className="text-xs text-green-600 mt-1">{stat.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.student}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-4 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Enroll New Student</p>
                  <p className="text-sm text-slate-600">Add a new student to the portal</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Upload Content</p>
                  <p className="text-sm text-slate-600">Share notes and files with students</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-4 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Upload Video Course</p>
                  <p className="text-sm text-slate-600">Add secure video content</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
