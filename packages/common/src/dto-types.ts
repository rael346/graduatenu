import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { CourseWarning, IWarning, Schedule, ScheduleCourse } from "./types";

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsObject()
  schedule: Schedule;

  @IsString()
  major: string;

  @IsString()
  coopCycle: string;

  @IsString()
  concentration: string;

  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear: number;

  @IsArray()
  courseWarnings: CourseWarning[];

  @IsArray()
  warnings: IWarning[];
}

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  schedule?: Schedule;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  coopCycle?: string;

  @IsOptional()
  @IsString()
  concentration?: string;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear?: number;

  @IsOptional()
  @IsArray()
  courseWarnings?: CourseWarning[];

  @IsOptional()
  @IsArray()
  warnings?: IWarning[];
}

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsString()
  nuid: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsInt()
  @Min(1898) // the year NEU was established
  @Max(3000) // will GraduateNU last beyond year 3000?!
  academicYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  graduateYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear?: number;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  coopCycle?: string;

  @IsOptional()
  @IsObject()
  coursesCompleted?: ScheduleCourse[];

  @IsOptional()
  @IsObject()
  coursesTransfered?: ScheduleCourse[];

  @IsOptional()
  @IsInt()
  primaryPlanId?: number;

  @IsOptional()
  @IsString()
  concentration?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  nuid?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password?: string;

  @IsOptional()
  @IsInt()
  @Min(1898) // the year NEU was established
  @Max(3000) // will GraduateNU last beyond year 3000?!
  academicYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  graduateYear?: number;

  @IsOptional()
  @IsInt()
  @Min(1898)
  @Max(3000)
  catalogYear?: number;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString()
  coopCycle?: string;

  @IsOptional()
  @IsObject()
  coursesCompleted?: ScheduleCourse[];

  @IsOptional()
  @IsObject()
  coursesTransfered?: ScheduleCourse[];

  @IsOptional()
  @IsInt()
  primaryPlanId?: number;

  @IsOptional()
  @IsString()
  concentration?: string;
}

export class LoginStudentDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
