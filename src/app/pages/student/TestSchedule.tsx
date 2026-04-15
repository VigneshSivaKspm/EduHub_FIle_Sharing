import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Calendar, CheckCircle2, Zap } from "lucide-react";

export default function TestSchedule() {
  const { user } = useAuth();
  const { batches, getTestsByBatch } = useData();

  const currentBatch = batches.find((b) => b.id === user?.batchId);
  const batchTests = user?.batchId ? getTestsByBatch(user.batchId) : [];

  if (!user?.batchId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">Test Schedule</h1>
        <Alert>
          <AlertTitle>Not Enrolled</AlertTitle>
          <AlertDescription>
            You are not enrolled in any batch. Please contact administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const activeTests = batchTests.filter((t) => t.status === "active");
  const closedTests = batchTests.filter((t) => t.status === "closed");
  const upcomingTests = batchTests.filter((t) => t.status === "upcoming");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">START NOW</Badge>;
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const TestTableSection = ({
    title,
    tests,
    icon: Icon,
  }: {
    title: string;
    tests: any[];
    icon: any;
  }) => {
    if (tests.length === 0) return null;

    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test No</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Test Portion</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test.id} className="hover:bg-slate-50">
                      <TableCell className="font-semibold text-indigo-600">
                        {test.testNo}
                      </TableCell>
                      <TableCell className="text-sm">{test.testDate}</TableCell>
                      <TableCell className="text-sm">{test.portion}</TableCell>
                      <TableCell className="text-sm">
                        {test.startTime} – {test.endTime}
                      </TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
                      <TableCell className="text-right">
                        {test.status === "active" ? (
                          <Button
                            onClick={() => window.open(test.cbtLink, "_blank")}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            size="sm"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            START NOW
                          </Button>
                        ) : (
                          <Button
                            disabled
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            {test.status === "closed" ? "Closed" : "Coming"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          {currentBatch?.name} - Test Schedule
        </h1>
        <p className="text-slate-600 mt-1">
          View and take your CBT examinations
        </p>
      </div>

      <Alert className="border-indigo-200 bg-indigo-50">
        <Calendar className="h-4 w-4 text-indigo-600" />
        <AlertTitle className="text-indigo-900">Total Tests</AlertTitle>
        <AlertDescription className="text-indigo-800">
          You have {batchTests.length} tests scheduled for this batch
        </AlertDescription>
      </Alert>

      {/* Active Tests */}
      <TestTableSection title="Active Tests" tests={activeTests} icon={Zap} />

      {/* Upcoming Tests */}
      <TestTableSection
        title="Upcoming Tests"
        tests={upcomingTests}
        icon={Calendar}
      />

      {/* Closed Tests */}
      <TestTableSection
        title="Previous Tests"
        tests={closedTests}
        icon={CheckCircle2}
      />

      {/* No Tests */}
      {batchTests.length === 0 && (
        <Card>
          <CardContent className="pt-8 text-center pb-8">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium">No Tests Scheduled</p>
            <p className="text-sm text-slate-500 mt-1">
              Tests will appear here when scheduled by your instructor
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
