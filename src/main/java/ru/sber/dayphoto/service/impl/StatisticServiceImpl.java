package ru.sber.dayphoto.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.sber.dayphoto.model.Statistic;
import ru.sber.dayphoto.repository.StatisticRepository;
import ru.sber.dayphoto.service.StatisticService;
import ru.sber.dayphoto.to.UserStatisticTimeTo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class StatisticServiceImpl implements StatisticService {

    @Autowired
    private StatisticRepository statisticRepository;

    @Override
    public Statistic save(Statistic entity) {
        return statisticRepository.save(entity);
    }

    @Override
    public boolean delete(long id) {
        return statisticRepository.delete(id) != 0;
    }

    @Override
    public Statistic get(long id) {
        return statisticRepository.findById(id).orElse(null);
    }

    @Override
    public List<Statistic> getAll() {
        return statisticRepository.findAll();
    }

    @Override
    public LocalTime getTotalDayTime(long userId) {
        return statisticRepository.getTotalDayTime(userId, LocalDate.now()).orElse(LocalTime.of(0,0,0));
    }

    @Override
    public List<UserStatisticTimeTo> getAllUserTotalDayTime(LocalDate from, LocalDate to){
        return statisticRepository.getAllUserTotalDayTime(from, to);
    }

    @Override
    public List<UserStatisticTimeTo> getAllUserTotalDayTimeWithActivityDetails(LocalDate from, LocalDate to) {
        return statisticRepository.getAllUserTotalDayTimeWithActivityDetails(from, to);
    }
}
