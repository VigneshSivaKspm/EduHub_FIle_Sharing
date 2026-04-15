import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Video, FileText, Download, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function StudentDashboard() {
  const { content, videos } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter content available to the current user
  const availableContent = content.filter(item => 
    item.visibilityType === 'ALL' || 
    (item.visibilityType === 'SELECTIVE' && item.selectedStudents?.includes('1'))
  );

  const availableVideos = videos.filter(video => 
    video.visibilityType === 'ALL' || 
    (video.visibilityType === 'SELECTIVE' && video.selectedStudents?.includes('1'))
  );

  const recentContent = availableContent.slice(0, 3);
  const recentVideos = availableVideos.slice(0, 2);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user?.name}!</h1>
        <p className="text-slate-600 mt-1">Here's what's new in your courses</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Available Resources
            </CardTitle>
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{availableContent.length}</div>
            <p className="text-xs text-slate-500 mt-1">Course materials</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Video Courses
            </CardTitle>
            <Video className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{availableVideos.length}</div>
            <p className="text-xs text-slate-500 mt-1">Video lessons</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Content
            </CardTitle>
            <FileText className="w-5 h-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {availableContent.length + availableVideos.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Learning materials</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Resources</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/resources')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentContent.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-3 border border-slate-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-slate-500">{item.uploadDate}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Videos</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/student/videos')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentVideos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/student/video/${video.id}`)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Video className="w-5 h-5 text-slate-900 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white hover:bg-black/70">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </Badge>
                  </div>
                </div>
                <h4 className="font-medium text-slate-900">{video.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-2">{video.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-white rounded-lg border border-indigo-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-slate-900">New Course Materials Available</p>
                <p className="text-sm text-slate-600 mt-1">
                  Check out the latest resources on Data Structures & Algorithms
                </p>
                <p className="text-xs text-slate-500 mt-2">2 days ago</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-slate-400 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-slate-900">Upcoming Assessment</p>
                <p className="text-sm text-slate-600 mt-1">
                  Prepare for the mid-term assessment scheduled for next week
                </p>
                <p className="text-xs text-slate-500 mt-2">5 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
