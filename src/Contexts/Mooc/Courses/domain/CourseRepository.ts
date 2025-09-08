import { Course } from './Course';

export interface CourseRepository {
  save(course: Course): Promise<void>;
  searchAll(): Promise<Array<Course>>;
  remove(courseId: string): Promise<void>;
}
