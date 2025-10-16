import { schooldb } from './assets/school_db.js';

const AITool = {

getSchoolName(name) {
    const school = schooldb.find(s => s.name.toLowerCase() === name.toLowerCase());
    return school ? school.name : "School not found";
},

getSchoolAddress(name) {
  const school = schooldb.find(s => s.name.toLowerCase() === name.toLowerCase());
  return school ? school.address : "School not found";
},

getClassById(id) {
    const schoolClass = schooldb.flatMap(s => s.classes).find(c => c.id === id);
    return schoolClass ? schoolClass : "Class not found";
},

getClassByName(name) {
    const schoolClass = schooldb.flatMap(s => s.classes).find(c => c.name.toLowerCase() === name.toLowerCase());
    return schoolClass ? schoolClass : "Class not found";
},

getSubjectById(id) {
    const subject = schooldb.flatMap(s => s.classes).flatMap(c => c.subjects).find(sub => sub.id === id);
    return subject ? subject : "Subject not found";
},

getSubjectByName(name) {
    const subject = schooldb.flatMap(s => s.classes).flatMap(c => c.subjects).find(sub => sub.name.toLowerCase() === name.toLowerCase());
    return subject ? subject : "Subject not found";
},

getStudentById(id) {
    const student = schooldb.flatMap(s => s.classes).flatMap(c => c.students).find(stu => stu.id === id);
    return student ? student : "Student not found";
},

getStudentByName(name) {
    const student = schooldb.flatMap(s => s.classes).flatMap(c => c.students).find(stu => stu.name.toLowerCase() === name.toLowerCase());
    return student ? student : "Student not found";
},

getStudentsByClassId(classId) {
    const students = schooldb.flatMap(s => s.classes).flatMap(c => c.students).filter(stu => stu.class_id === classId);
    return students.length > 0 ? students : "No students found";
},

getSubjectsByStudentId(studentId) {
    const student = schooldb.flatMap(s => s.classes).flatMap(c => c.students).find(stu => stu.id === studentId);
    if (!student) return "Student not found";
    const classId = student.class_id;
    const subjects = schooldb.flatMap(s => s.classes).find(c => c.id === classId)?.subjects || [];
    return subjects.length > 0 ? subjects : "No subjects found";
},

getTeacherById(id) {
    const teacher = schooldb.flatMap(s => s.classes).flatMap(c => c.teachers).find(t => t.id === id);
    return teacher ? teacher : "Teacher not found";
},
getTeacherByName(name) {
    const teacher = schooldb.flatMap(s => s.classes).flatMap(c => c.teachers).find(t => t.name.toLowerCase() === name.toLowerCase());
    return teacher ? teacher : "Teacher not found";
},

getSubjectsByTeacherId(teacherId) {
    const subjects = schooldb.flatMap(s => s.classes).flatMap(c => c.subjects).filter(sub => sub.teacher_id === teacherId);
    return subjects.length > 0 ? subjects : "No subjects found";
},

getTeachersBySubjectId(subjectId) {
    const subject = schooldb.flatMap(s => s.classes).flatMap(c => c.subjects).find(sub => sub.id === subjectId);
    if (!subject) return "Subject not found";
    const teacherId = subject.teacher_id;
    const teacher = schooldb.flatMap(s => s.classes).flatMap(c => c.teachers).find(t => t.id === teacherId);
    return teacher ? teacher : "Teacher not found";
},

getEmployeeById(id) {
    const employee = schooldb.flatMap(s => s.employees).find(e => e.id === id);
    return employee ? employee : "Employee not found";
},

getEmployeeByName(name) {
    const employee = schooldb.flatMap(s => s.employees).find(e => e.name.toLowerCase() === name.toLowerCase());
    return employee ? employee : "Employee not found";
},

getEmployeesByRole(role) {
    const employees = schooldb.flatMap(s => s.employees).filter(e => e.role.toLowerCase() === role.toLowerCase());
    return employees.length > 0 ? employees : "No employees found";
},

getAllRoles() {
    const roles = [...new Set(schooldb.flatMap(s => s.employees).map(e => e.role))];
    return roles.length > 0 ? roles : "No roles found";
},

getAttendanceByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date);
    return attendanceRecords.length > 0 ? attendanceRecords : "No attendance records found";
},

getAttendanceByStudentId(studentId) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.student_id === studentId);
    return attendanceRecords.length > 0 ? attendanceRecords : "No attendance records found";
},

countStudentPresentDays(studentId) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.student_id === studentId && a.status.toLowerCase() === 'present');
    return attendanceRecords.length;
},

getAttendanceSummaryByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date);
    const summary = { present: 0, absent: 0, late: 0 };
    attendanceRecords.forEach(a => {
        if (a.status.toLowerCase() === 'present') summary.present++;
        else if (a.status.toLowerCase() === 'absent') summary.absent++;
        else if (a.status.toLowerCase() === 'late') summary.late++;
    });
    return summary;
},

getStudentAttendanceWithName(studentId) {
    const student = this.getStudentById(studentId);
    if (typeof student === 'string') return student;
    const attendance = this.getAttendanceByStudentId(studentId);
    return { student: student.name, attendance: attendance };
},

getTeacherAttendanceByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date && a.role && a.role.toLowerCase() === 'teacher');
    return attendanceRecords.length > 0 ? attendanceRecords : "No teacher attendance records found";
},

getTeacherAttendanceById(teacherId) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.teacher_id === teacherId && a.role && a.role.toLowerCase() === 'teacher');
    return attendanceRecords.length > 0 ? attendanceRecords : "No teacher attendance records found";
},

getPresentTeachersByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date && a.status.toLowerCase() === 'present' && a.role && a.role.toLowerCase() === 'teacher');
    const teacherIds = [...new Set(attendanceRecords.map(a => a.teacher_id))];
    const teachers = teacherIds.map(id => this.getTeacherById(id)).filter(t => typeof t !== 'string');
    return teachers.length > 0 ? teachers : "No present teachers found";
},

getAbsentTeachersByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date && a.status.toLowerCase() === 'absent' && a.role && a.role.toLowerCase() === 'teacher');
    const teacherIds = [...new Set(attendanceRecords.map(a => a.teacher_id))];
    const teachers = teacherIds.map(id => this.getTeacherById(id)).filter(t => typeof t !== 'string');
    return teachers.length > 0 ? teachers : "No absent teachers found";
},

getTeacherAttendanceSummaryByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.classes).flatMap(c => c.attendance).filter(a => a.date === date && a.role && a.role.toLowerCase() === 'teacher');
    const summary = { present: 0, absent: 0, late: 0 };
    attendanceRecords.forEach(a => {
        if (a.status.toLowerCase() === 'present') summary.present++;
        else if (a.status.toLowerCase() === 'absent') summary.absent++;
        else if (a.status.toLowerCase() === 'late') summary.late++;
    });
    return summary;
},

getEmployeeAttendanceByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.employees).flatMap(e => e.attendance || []).filter(a => a.date === date);
    return attendanceRecords.length > 0 ? attendanceRecords : "No employee attendance records found";
},

getEmployeeAttendanceById(employeeId) {
    const attendanceRecords = schooldb.flatMap(s => s.employees).flatMap(e => e.attendance || []).filter(a => a.employee_id === employeeId);
    return attendanceRecords.length > 0 ? attendanceRecords : "No employee attendance records found";
},

getPresentEmployeesByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.employees).flatMap(e => e.attendance || []).filter(a => a.date === date && a.status.toLowerCase() === 'present');
    const employeeIds = [...new Set(attendanceRecords.map(a => a.employee_id))];
    const employees = employeeIds.map(id => this.getEmployeeById(id)).filter(e => typeof e !== 'string');
    return employees.length > 0 ? employees : "No present employees found";
},

getAbsentEmployeesByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.employees).flatMap(e => e.attendance || []).filter(a => a.date === date && a.status.toLowerCase() === 'absent');
    const employeeIds = [...new Set(attendanceRecords.map(a => a.employee_id))];
    const employees = employeeIds.map(id => this.getEmployeeById(id)).filter(e => typeof e !== 'string');
    return employees.length > 0 ? employees : "No absent employees found";
},

getEmployeeAttendanceSummaryByDate(date) {
    const attendanceRecords = schooldb.flatMap(s => s.employees).flatMap(e => e.attendance || []).filter(a => a.date === date);
    const summary = { present: 0, absent: 0, late: 0 };
    attendanceRecords.forEach(a => {
        if (a.status.toLowerCase() === 'present') summary.present++;
        else if (a.status.toLowerCase() === 'absent') summary.absent++;
        else if (a.status.toLowerCase() === 'late') summary.late++;
    });
    return summary;
},
};

export const toolsList = [
  { name: "getSchoolName", description: "Get School Name", func: AITool.getSchoolName, parameters: {} },
  { name: "getSchoolAddress", description: "Get School Address", func: AITool.getSchoolAddress, parameters: {} },
  { name: "getClassById", description: "Get Class By ID", func: AITool.getClassById, parameters: { id: "number" } },
  { name: "getClassByName", description: "Get Class By Name", func: AITool.getClassByName, parameters: { name: "string" } },
  { name: "getSubjectById", description: "Get Subject By ID", func: AITool.getSubjectById, parameters: { id: "number" } },
  { name: "getSubjectByName", description: "Get Subject By Name", func: AITool.getSubjectByName, parameters: { name: "string" } },
  { name: "getStudentById", description: "Get Student By ID", func: AITool.getStudentById, parameters: { id: "number" } },
  { name: "getStudentByName", description: "Get Student By Name", func: AITool.getStudentByName, parameters: { name: "string" } },
  { name: "getStudentsByClassId", description: "Get Students By Class ID", func: AITool.getStudentsByClassId, parameters: { classId: "number" } },
  { name: "getSubjectsByStudentId", description: "Get Subjects By Student ID", func: AITool.getSubjectsByStudentId, parameters: { studentId: "number" } },
  { name: "getTeacherById", description: "Get Teacher By ID", func: AITool.getTeacherById, parameters: { id: "number" } },
  { name: "getTeacherByName", description: "Get Teacher By Name", func: AITool.getTeacherByName, parameters: { name: "string" } },
  { name: "getSubjectsByTeacherId", description: "Get Subjects By Teacher ID", func: AITool.getSubjectsByTeacherId, parameters: { teacherId: "number" } },
  { name: "getTeachersBySubjectId", description: "Get Teachers By Subject ID", func: AITool.getTeachersBySubjectId, parameters: { subjectId: "number" } },
  { name: "getEmployeeById", description: "Get Employee By ID", func: AITool.getEmployeeById, parameters: { id: "number" } },
  { name: "getEmployeeByName", description: "Get Employee By Name", func: AITool.getEmployeeByName, parameters: { name: "string" } },
  { name: "getEmployeesByRole", description: "Get Employees By Role", func: AITool.getEmployeesByRole, parameters: { role: "string" } },
  { name: "getAllRoles", description: "Get All Roles", func: AITool.getAllRoles, parameters: {} },
  { name: "getAttendanceByDate", description: "Get Attendance By Date", func: AITool.getAttendanceByDate, parameters: { date: "string" } },
  { name: "getAttendanceByStudentId", description: "Get Attendance By Student ID", func: AITool.getAttendanceByStudentId, parameters: { studentId: "number" } },
  { name: "countStudentPresentDays", description: "Count Student Present Days", func: AITool.countStudentPresentDays, parameters: { studentId: "number" } },
  { name: "getAttendanceSummaryByDate", description: "Get Attendance Summary By Date", func: AITool.getAttendanceSummaryByDate, parameters: { date: "string" } },
  { name: "getStudentAttendanceWithName", description: "Get Student Attendance With Name", func: AITool.getStudentAttendanceWithName, parameters: { studentId: "number" } },
  { name: "getTeacherAttendanceByDate", description: "Get Teacher Attendance By Date", func: AITool.getTeacherAttendanceByDate, parameters: { date: "string" } },
  { name: "getTeacherAttendanceById", description: "Get Teacher Attendance By ID", func: AITool.getTeacherAttendanceById, parameters: { teacherId: "number" } },
  { name: "getPresentTeachersByDate", description: "Get Present Teachers By Date", func: AITool.getPresentTeachersByDate, parameters: { date: "string" } },
  { name: "getAbsentTeachersByDate", description: "Get Absent Teachers By Date", func: AITool.getAbsentTeachersByDate, parameters: { date: "string" } },
  { name: "getTeacherAttendanceSummaryByDate", description: "Get Teacher Attendance Summary By Date", func: AITool.getTeacherAttendanceSummaryByDate, parameters: { date: "string" } },
  { name: "getEmployeeAttendanceByDate", description: "Get Employee Attendance By Date", func: AITool.getEmployeeAttendanceByDate, parameters: { date: "string" } },
  { name: "getEmployeeAttendanceById", description: "Get Employee Attendance By ID", func: AITool.getEmployeeAttendanceById, parameters: { employeeId: "number" } },
  { name: "getPresentEmployeesByDate", description: "Get Present Employees By Date", func: AITool.getPresentEmployeesByDate, parameters: { date: "string" } },
  { name: "getAbsentEmployeesByDate", description: "Get Absent Employees By Date", func: AITool.getAbsentEmployeesByDate, parameters: { date: "string" } },
  { name: "getEmployeeAttendanceSummaryByDate", description: "Get Employee Attendance Summary By Date", func: AITool.getEmployeeAttendanceSummaryByDate, parameters: { date: "string" } },
];

export default AITool;

