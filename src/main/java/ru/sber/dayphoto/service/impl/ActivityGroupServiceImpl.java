package ru.sber.dayphoto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sber.dayphoto.model.ActivityGroup;
import ru.sber.dayphoto.repository.ActivityGroupRepository;
import ru.sber.dayphoto.service.ActivityGroupService;

import java.util.List;

@Service
public class ActivityGroupServiceImpl implements ActivityGroupService {
    
    @Autowired
    private ActivityGroupRepository activityGroupRepository;
    
    @Override
    public ActivityGroup save(ActivityGroup entity) {
        return activityGroupRepository.save(entity);
    }

    @Override
    public boolean delete(long id) {
        return activityGroupRepository.delete(id) != 0;
    }

    @Override
    public ActivityGroup get(long id) {
        return activityGroupRepository.findById(id).orElse(null);
    }

    @Override
    public List<ActivityGroup> getAll() {
        return activityGroupRepository.findAll();
    }
}
