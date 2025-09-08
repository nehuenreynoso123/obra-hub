import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Controller } from './Controller';
import { CourseDelete } from '../../../../Contexts/Mooc/Courses/application/Delete/CourseDelete';

type CourseDeleteRequest = Request & {
  body: {
    id: string;
  };
};
export class CourseRemoveController implements Controller {
  constructor(private courseRemove: CourseDelete) {}
  async run(req: CourseDeleteRequest, res: Response) {
    try {
      const { id } = req.body;
      await this.courseRemove.run( id );
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
