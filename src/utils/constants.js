export const UserRolesEnums={
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMBER:"member"
}

export const AvailableUserRolesEnum=Object.values(UserRolesEnums)
// console.log(typeof AvailableUserRolesEnum) --> ARRAY ( user ko array bhejunga toh usko easy padega array pe loop lagakar)

export const TaskStatusEnum={
    TODO :"todo",
    IN_PROGRESS:"in_progress",
    DONE :"done"
}

export const AvailableTaskStatusEnum=Object.values(AvailableTaskStatusEnum)