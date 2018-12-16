package ru.sber.dayphoto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class BaseEntity {
    private Long id;

    public boolean isNew() {return id == null;}

    @Override
    public boolean equals(Object o){
        if (this == o) return true;
        if (o == null) return false;
        if (getClass() != o.getClass()) return false;
        BaseEntity baseEntity = (BaseEntity) o;
        if (baseEntity.id == null) return false;
        return id.equals(baseEntity.id);
    }

    @Override
    public int hashCode() {
        return id == null ? 0 : Long.hashCode(id);
    }
}
