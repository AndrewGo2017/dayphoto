package ru.sber.dayphoto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "activity_groups")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ActivityGroup extends BaseEntity {
    private String name;

    @Column(name = "is_active")
    private Boolean isActive;

    public ActivityGroup(Long id, String name, Boolean isActive) {
        super(id);
        this.name = name;
        this.isActive = isActive;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isBold) {
        this.isActive = isBold == null ? false : isBold;
    }
}
