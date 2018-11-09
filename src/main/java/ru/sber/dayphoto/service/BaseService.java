package ru.sber.dayphoto.service;

import ru.sber.dayphoto.model.BaseEntity;

import java.util.List;

public interface BaseService<Entity extends BaseEntity> {
    Entity save(Entity entity);

    boolean delete(long id);

    Entity get(long id);

    List<Entity> getAll();
}