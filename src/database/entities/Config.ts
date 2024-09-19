import { Entity, ObjectId, ObjectIdColumn, Column } from "typeorm"

@Entity({ name: "config" })
export class Config {
    @ObjectIdColumn()
    _id: ObjectId

    @Column()
    key: string

    @Column()
    value: string
}