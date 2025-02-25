import {
  InvalidRequest,
  MissingParameter,
  UserNotAuthenticated,
} from "../../../core/helpers/errors/ModuleError";
import { TokenAuth } from "../../../core/helpers/functions/token_auth";
import { IUserRepo } from "../../../core/repositories/interfaces/IUserRepo";
import { UserTypeEnum } from "../../../core/helpers/enums/UserTypeEnum";

export class UpdateUserUsecase {
  public token_auth: TokenAuth;
  public database_repo: IUserRepo;

  constructor(database_repo: IUserRepo) {
    this.token_auth = new TokenAuth();
    this.database_repo = database_repo;
  }

  public async execute(
    headers: { [key: string]: any },
    body: { [key: string]: any }
  ) {
    if (!headers) {
      throw new InvalidRequest("Headers");
    }
    if (!body) {
      throw new InvalidRequest("Body");
    }
    if (!headers.Authorization) {
      throw new MissingParameter("Authorization");
    }
    if (!body.semester_course) {
      throw new MissingParameter("Semester");
    }
    if (!body.course) {
      throw new MissingParameter("Course");
    }

    const user_student_id = await this.token_auth
      .decode_token(headers.Authorization)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw new UserNotAuthenticated("Invalid or expired token.");
      });

    const user_student = await this.database_repo.get_user(user_student_id);
    if (!user_student) {
      throw new UserNotAuthenticated("User not found.");
    }

    const updatedUser = await this.database_repo.update_user(
      user_student_id, 
      body.course,
      body.semester_course
    );

    return updatedUser;
  }
}
