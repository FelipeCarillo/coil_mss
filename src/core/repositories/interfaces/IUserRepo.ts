import { User } from '../../structure/entities/User';	

export interface IUserRepo {
    create_user(user: User): Promise<boolean>;
    update_user(userId: string, course: String, semester_course: number): Promise<User>;
    get_user(id: string): Promise<User | null>;
    get_user_by_email(email: string): Promise<User | null>;
}