package ru.sber.dayphoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.service.StatisticService;
import ru.sber.dayphoto.to.UserStatisticTimeTo;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequestMapping("/statistic")
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Статистика");
        m.addAttribute("hideAddButton", "");
        return "statistic";
    }

//    @PostMapping
//    public String save(Statistic entity) {
//         statisticService.save(entity);
//        return "dictionary";
//    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        statisticService.delete(id);
        return "statistic";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<UserStatisticTimeTo> statistics = statisticService.getAllUserTotalDayTimeWithActivityDetails(LocalDate.now(), LocalDate.now());
        m.addAttribute("statistics", statistics);
        return "fragments/tables :: statisticList";
    }

    @GetMapping("/all/{type}/{from}/{to}")
    public String getAllTotal(Model m,
                              @PathVariable("type") Integer type,
                              @PathVariable("from") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate from,
                              @PathVariable("to") @DateTimeFormat(pattern = "dd.MM.yyyy") LocalDate to){
        List<UserStatisticTimeTo> statistics;
        if (type == 1){
            statistics = statisticService.getAllUserTotalDayTimeWithActivityDetails(from, to);
            m.addAttribute("statistics", statistics);
            return "fragments/tables :: statisticList";

        } else {
            statistics = statisticService.getAllUserTotalDayTime(from, to);
            m.addAttribute("statistics", statistics);
            return "fragments/tables :: statistic1List";
        }
    }
}

//@DateTimeFormat(pattern = "dd-MM-yyyy")