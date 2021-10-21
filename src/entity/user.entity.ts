import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    uid: string;

    @Column({ unique: true })
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: () => false })
    isValidated: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: string;
}