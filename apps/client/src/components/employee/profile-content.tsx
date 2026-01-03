"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Mail,
    Briefcase,
    Calendar,
    Phone,
    MapPin,
    Edit,
    IdCard,
    DollarSign,
    Building2,
    User,
    Plus,
} from "lucide-react";
import EditEmployeeDialog from "@/components/shared/edit-employee-dialog";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchUserProfile } from "@/redux/slices/authSlice";
import { updateEmployeeInfo } from "@/redux/slices/employeeSlice";
import { useEffect } from "react";

export default function ProfileContent() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isEditingPrivate, setIsEditingPrivate] = useState(false);
    const [isEditingResume, setIsEditingResume] = useState(false);

    useEffect(() => {
        if (!user) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, user]);

    const handleSave = (data: any) => {
        dispatch(fetchUserProfile());
        console.log("Updated profile:", data);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    // Mock salary data
    const salaryData = {
        wage: 50000,
        basicPercent: 50,
        basic: 25000,
        hraPercent: 50,
        hra: 12500,
        standardAllowance: 5000,
        ltaPercent: 10,
        lta: 2500,
        totalComponents: 45000,
        pfRate: 12,
        pfAmount: 5400,
        professionalTax: 200,
        totalDeductions: 5600,
        netSalary: 39400,
    };

    // Mock resume data
    const [resumeData, setResumeData] = useState({
        about: "Passionate software developer with 3+ years of experience in building scalable web applications. Proficient in React, Node.js, and modern web technologies.",
        loveAboutJob: "I love the collaborative environment and the opportunity to solve complex problems. Working with cutting-edge technologies and seeing my code make a real impact on users is incredibly rewarding.",
        hobbies: "In my free time, I enjoy hiking, photography, and contributing to open-source projects. I'm also passionate about learning new programming languages and frameworks.",
        skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
        certifications: ["AWS Certified Developer", "React Professional Certification"],
    });


    return (
        <div className="w-[100%]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">View and manage your personal information</p>
            </div>

            {/* Profile Header Card */}
            <Card className="mb-6">
                <CardContent className="pr-8 pl-8">
                    <div className="flex items-start gap-8">
                        <div className="relative mr-16">
                            <Avatar className="w-32 h-32">
                                <AvatarImage src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`} />
                                <AvatarFallback className="text-3xl">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => setDialogOpen(true)}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700"
                            >
                                <Edit size={18} />
                            </button>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm text-gray-500">My Name</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.firstName} {user.lastName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Job Position</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.position}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Email</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Mobile</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.phoneNumber}</p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-sm text-gray-500">Company</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.companyName}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Department</Label>
                                    <p className="font-medium text-gray-900 mt-1">{user.department}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Manager</Label>
                                    <p className="font-medium text-gray-900 mt-1">N/A</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-500">Location</Label>
                                    <p className="font-medium text-gray-900 mt-1">Remote</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="resume" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="resume">Resume</TabsTrigger>
                    <TabsTrigger value="private">Private Info</TabsTrigger>
                    <TabsTrigger value="salary">Salary Info</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                {/* Resume Tab */}
                <TabsContent value="resume">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Resume</h3>
                        {!isEditingResume ? (
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={() => setIsEditingResume(true)}
                            >
                                <Edit size={16} />
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEditingResume(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-teal-600 hover:bg-teal-700"
                                    onClick={() => {
                                        setIsEditingResume(false);
                                        // Save logic here
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column - About and additional fields */}
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                                    <Textarea
                                        value={resumeData.about}
                                        onChange={(e) => setResumeData({ ...resumeData, about: e.target.value })}
                                        className="min-h-[120px] resize-none"
                                        placeholder="Tell us about yourself..."
                                        disabled={!isEditingResume}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What I love about my job</h3>
                                    <Textarea
                                        value={resumeData.loveAboutJob}
                                        onChange={(e) => setResumeData({ ...resumeData, loveAboutJob: e.target.value })}
                                        className="min-h-[120px] resize-none"
                                        placeholder="What do you love about your job..."
                                        disabled={!isEditingResume}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My interests and hobbies</h3>
                                    <Textarea
                                        value={resumeData.hobbies}
                                        onChange={(e) => setResumeData({ ...resumeData, hobbies: e.target.value })}
                                        className="min-h-[120px] resize-none"
                                        placeholder="Tell us about your interests and hobbies..."
                                        disabled={!isEditingResume}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Skills and Certifications */}
                        <div className="space-y-6">
                            {/* Skills */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <Plus size={16} />
                                            Add Skills
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {resumeData.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="px-3 py-1">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Certifications */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Certification</h3>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <Plus size={16} />
                                            Add Skills
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {resumeData.certifications.map((cert, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                                <p className="text-sm text-gray-700">{cert}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Private Info Tab */}
                <TabsContent value="private">
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Private Information</h3>
                                {!isEditingPrivate ? (
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => setIsEditingPrivate(true)}
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsEditingPrivate(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-teal-600 hover:bg-teal-700"
                                            onClick={() => {
                                                setIsEditingPrivate(false);
                                                // Save logic here
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div>
                                        <Label htmlFor="dob">Date of Birth</Label>
                                        <Input
                                            id="dob"
                                            type="date"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                            defaultValue="1995-06-15"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="address">Residing Address</Label>
                                        <Input
                                            id="address"
                                            defaultValue="N/A"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nationality">Nationality</Label>
                                        <Input
                                            id="nationality"
                                            defaultValue="Indian"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="personalEmail">Personal Email</Label>
                                        <Input
                                            id="personalEmail"
                                            type="email"
                                            defaultValue={user.email}
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="gender">Gender</Label>
                                        <Input
                                            id="gender"
                                            defaultValue="Male"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="maritalStatus">Marital Status</Label>
                                        <Input
                                            id="maritalStatus"
                                            defaultValue="Single"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="joiningDate" className="text-lg font-semibold">Date of Joining</Label>
                                        <Input
                                            id="joiningDate"
                                            type="date"
                                            defaultValue={`${user.joiningYear}-01-01`}
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                </div>

                                {/* Right Column - Bank Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
                                    <div>
                                        <Label htmlFor="accountNumber">Account Number</Label>
                                        <Input
                                            id="accountNumber"
                                            defaultValue="XXXXXXXXXXXX"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bankName">Bank Name</Label>
                                        <Input
                                            id="bankName"
                                            defaultValue="HDFC Bank"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="ifsc">IFSC Code</Label>
                                        <Input
                                            id="ifsc"
                                            defaultValue="HDFC0001234"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pan">PAN No</Label>
                                        <Input
                                            id="pan"
                                            defaultValue="XXXXXXXXXX"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="uan">UAN NO</Label>
                                        <Input
                                            id="uan"
                                            defaultValue="XXXXXXXXXXXX"
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="empCode">Emp Code</Label>
                                        <Input
                                            id="empCode"
                                            defaultValue={user.loginId}
                                            className="mt-2"
                                            disabled={!isEditingPrivate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Salary Information Tab */}
                <TabsContent value="salary">
                    <Card>
                        <CardContent className="p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Salary Breakdown</h3>

                            {/* Wage */}
                            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-700">Monthly Wage</span>
                                    <span className="text-2xl font-bold text-teal-600">
                                        ₹{salaryData.wage.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Salary Components */}
                            <div className="space-y-4 mb-6">
                                <h4 className="font-semibold text-gray-900">Salary Components</h4>

                                <div className="space-y-3">
                                    {/* Basic */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Basic</p>
                                            <p className="text-sm text-gray-600">{salaryData.basicPercent}% of Wage</p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            ₹{salaryData.basic.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* HRA */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">HRA (House Rent Allowance)</p>
                                            <p className="text-sm text-gray-600">{salaryData.hraPercent}% of Basic</p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            ₹{salaryData.hra.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Standard Allowance */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Standard Allowance</p>
                                            <p className="text-sm text-gray-600">Fixed Amount</p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            ₹{salaryData.standardAllowance.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* LTA */}
                                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">LTA (Leave Travel Allowance)</p>
                                            <p className="text-sm text-gray-600">{salaryData.ltaPercent}% of Basic</p>
                                        </div>
                                        <span className="font-semibold text-gray-900">
                                            ₹{salaryData.lta.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Total Components */}
                                    <div className="flex justify-between items-center p-3 bg-teal-50 border border-teal-200 rounded-lg">
                                        <p className="font-semibold text-gray-900">Total Components</p>
                                        <span className="font-bold text-teal-600">
                                            ₹{salaryData.totalComponents.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Deductions */}
                            <div className="space-y-4 mb-6">
                                <h4 className="font-semibold text-gray-900">Deductions</h4>

                                <div className="space-y-3">
                                    {/* PF */}
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">PF (Provident Fund)</p>
                                            <p className="text-sm text-gray-600">{salaryData.pfRate}% of Total Components</p>
                                        </div>
                                        <span className="font-semibold text-red-600">
                                            -₹{salaryData.pfAmount.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Professional Tax */}
                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Professional Tax</p>
                                            <p className="text-sm text-gray-600">Fixed Amount</p>
                                        </div>
                                        <span className="font-semibold text-red-600">
                                            -₹{salaryData.professionalTax.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Total Deductions */}
                                    <div className="flex justify-between items-center p-3 bg-red-100 border border-red-200 rounded-lg">
                                        <p className="font-semibold text-gray-900">Total Deductions</p>
                                        <span className="font-bold text-red-600">
                                            -₹{salaryData.totalDeductions.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Salary */}
                            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-teal-100 mb-1">Net Monthly Salary</p>
                                        <p className="text-sm text-teal-100">
                                            Total Components - Total Deductions
                                        </p>
                                    </div>
                                    <span className="text-4xl font-bold">
                                        ₹{salaryData.netSalary.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <Card>
                        <CardContent className="p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h3>
                            <div className="space-y-6 max-w-md">
                                <div>
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" className="mt-2" />
                                </div>
                                <div>
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" className="mt-2" />
                                </div>
                                <Button className="bg-teal-600 hover:bg-teal-700">
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <EditEmployeeDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                employee={user}
                onSave={handleSave}
                isAdmin={false}
            />
        </div>
    );
}
