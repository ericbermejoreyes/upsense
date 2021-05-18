import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Zone } from './Zone';

@Entity({ name: 'notification_settings' })
export class NotificationSetting extends BaseEntity
{
    @Column({ type: 'enum', enum: ['sms', 'email', 'push_notifications'], nullable: false, default: 'email' })
    type!: string;

    @Column({ type: 'time', name: 'trigger_time', default: 0 })
    triggerTime!: number;

    @Column({ type: 'time', name: 'repeat_time', default: 0 })
    repeatTime!: number;

    @Column({ type: 'smallint', name: 'max_repeat', default: 0 })
    maxRepeat!: number;

    @ManyToOne(() => Zone, zone => zone.notificationSettings, { onDelete: 'CASCADE' })
    zone!: Zone;

    public serialize()
    {
        let serialized: any = {
            type: this.type,
            triggerTime: this.triggerTime,
            repeatTime: this.repeatTime,
            maxRepeat: this.maxRepeat,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };

        if (this.zone) {
            serialized.zone = this.zone.serialize();
        }

        return serialized;
    }
}
