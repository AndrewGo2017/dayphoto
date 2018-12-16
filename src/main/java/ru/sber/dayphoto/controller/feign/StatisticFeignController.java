package ru.sber.dayphoto.controller.feign;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.feign.StatisticFeign;
import ru.sber.dayphoto.to.StatisticTo;
import ru.sber.dayphoto.to.UserStatisticTimeTo;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Controller
@RequestMapping("/statistic")
public class StatisticFeignController {
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    @Autowired
    private StatisticFeign statisticFeign;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Статистика");
        m.addAttribute("hideAddButton", "");
        return "statistic";
    }

    @PostMapping
    public String save(StatisticTo statisticTo) {
        statisticFeign.create(statisticTo);
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        statisticFeign.delete(id);
        return "statistic";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<UserStatisticTimeTo> statistics = statisticFeign.getAllUserTotalDayTimeWithActivityDetails(LocalDate.now().format(dateTimeFormatter), LocalDate.now().format(dateTimeFormatter));
        m.addAttribute("statistics", statistics);
        return "fragments/tables :: statisticList";
    }

    @GetMapping("/all/{type}/{from}/{to}")
    public String getAllTotal(Model m,
                              @PathVariable("type") Integer type,
                              @PathVariable("from") String from,
                              @PathVariable("to") String to) throws InterruptedException {
        Thread.sleep(300);

        List<UserStatisticTimeTo> statistics;
        if (type == 1){
            statistics = statisticFeign.getAllUserTotalDayTimeWithActivityDetails(from, to);
            m.addAttribute("statistics", statistics);
            return "fragments/tables :: statisticList";

        } else {
            statistics = statisticFeign.getAllUserTotalDayTime(from, to);
            m.addAttribute("statistics", statistics);
            return "fragments/tables :: statistic1List";
        }
    }
}