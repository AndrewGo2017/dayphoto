package ru.sber.dayphoto.service;

import ru.sber.dayphoto.model.Activity;

import java.util.List;

public interface ActivityService extends BaseService<Activity> {
    List<Activity> getAllByActivityGroupId(long activityGroupId);
}
