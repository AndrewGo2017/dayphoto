package ru.sber.dayphoto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class Activity extends BaseEntity {

    private ActivityGroup activityGroup;

    private String name;

    private boolean isActive;

    public Activity(Long id, ActivityGroup activityGroup, String name, boolean isActive) {
        super(id);
        this.activityGroup = activityGroup;
        this.name = name;
        this.isActive = isActive;
    }
}
