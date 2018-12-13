package ru.sber.dayphoto.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import ru.sber.dayphoto.model.ActivityGroup;
import ru.sber.dayphoto.model.BaseEntity;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = true)
public class ActivityTo extends BaseTo {
    private Long activityGroup;

    private String name;

    private boolean isActive;

    public ActivityTo(Long id, Long activityGroup, String name, boolean isActive) {
        super(id);
        this.activityGroup = activityGroup;
        this.name = name;
        this.isActive = isActive;
    }
}
