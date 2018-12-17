package ru.sber.dayphoto.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.Statistic;
import ru.sber.dayphoto.to.StatisticTo;
import ru.sber.dayphoto.to.UserStatisticTimeTo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RequestMapping("/context/statistic")
@FeignClient(name="photodata", url="${photodata.ribbon.listOfServers}")
public interface StatisticFeign {
    @PostMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void create(StatisticTo statisticTo);

    @PostMapping(value = "/list" ,consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void createAll(List<StatisticTo> statisticTo);

    @PutMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void update(StatisticTo statisticTo);

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    Statistic get(@PathVariable("id") long id);

    @DeleteMapping(value = "/{id}")
    boolean delete(@PathVariable("id") long id);

    @GetMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<Statistic> getAll();

    @GetMapping(value = "/total-day-details/{from}/{to}",produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<UserStatisticTimeTo> getAllUserTotalDayTimeWithActivityDetails(@PathVariable("from") String from, @PathVariable("to") String to);

    @GetMapping(value = "/total-day/{from}/{to}",produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<UserStatisticTimeTo> getAllUserTotalDayTime(@PathVariable("from") String from, @PathVariable("to") String to);

    @GetMapping(value = "/total-day-time/{userId}",produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    LocalTime getTotalDayTime(@PathVariable("userId") Long userId);
}
