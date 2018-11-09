package ru.sber.dayphoto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "activities")
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Activity extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "activity_group_id")
    private ActivityGroup activityGroup;

    private String name;

    @Column(name = "is_active")
    private boolean isActive;

    public Activity(Long id, ActivityGroup activityGroup, String name, boolean isActive) {
        super(id);
        this.activityGroup = activityGroup;
        this.name = name;
        this.isActive = isActive;
    }
}
