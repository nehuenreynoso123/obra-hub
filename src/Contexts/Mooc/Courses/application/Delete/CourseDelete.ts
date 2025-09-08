import { CourseRepository } from '../../domain/CourseRepository';

export class CourseDelete {
  constructor(private repository: CourseRepository) {}
  async run(id: string): Promise<void> {
    await this.repository.remove(id);
  }
}
