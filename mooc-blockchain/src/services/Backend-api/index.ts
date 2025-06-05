import AuthService from "./auth-service";
import CourseService from "./course-service";

import UserService from "./user-service";
import EventService from "./event-service";
import CategoryService from "./category-service";
import SectionService from "./section-service";
import StatisticService from "./statistic-service";

const BackendService = {
    ...AuthService,
    ...CourseService,
    ...SectionService,
    ...UserService,
    ...EventService,
    ...CategoryService,
    ...StatisticService,
}

export default BackendService;