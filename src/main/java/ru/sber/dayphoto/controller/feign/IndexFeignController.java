package ru.sber.dayphoto.controller.feign;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.feign.StatisticFeign;
import ru.sber.dayphoto.feign.UserFeign;
import ru.sber.dayphoto.handler.accordion.Accordion;
import ru.sber.dayphoto.handler.accordion.AccordionHandler;
import ru.sber.dayphoto.model.User;
import ru.sber.dayphoto.to.StatisticTo;

import java.time.LocalTime;
import java.util.List;

@Controller
@RequestMapping("/index")
public class IndexFeignController {

    @Autowired
    private StatisticFeign statisticFeign;

    @Autowired
    private UserFeign userFeign;

    @GetMapping
    public String index(Model m) {
        return "index";
    }

    @PostMapping
    public ResponseEntity save(StatisticTo statisticTo) {
        if (statisticTo.isNew()){
            statisticFeign.create(statisticTo);
        }else {
            statisticFeign.update(statisticTo);
        }
        return ResponseEntity.ok("");
    }

    @GetMapping("/fragment/{id}")
    public String getFragment(Model m, @PathVariable("id") Long id) throws InterruptedException {
        Thread.sleep(300);
        LocalTime totalDayTime = statisticFeign.getTotalDayTime(id);

        m.addAttribute("totalTime", totalDayTime);
        return "fragments/common :: fragment";
    }

    @Autowired
    private AccordionHandler accordionHandler;

    @GetMapping("/accordion")
    public String getLoading(Model m) {
        List<Accordion> accordionList = accordionHandler.getAccordionList();
        m.addAttribute("accordions", accordionList);
        return "fragments/common :: accordion";
    }

    @GetMapping("/user")
    public String getUsers(Model m) throws InterruptedException {
        List<User> users = userFeign.getAll();
        m.addAttribute("users", users);
        return "fragments/common :: authDialog";
    }


    @PostMapping(value = "/list", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String saveAll(@RequestBody List<StatisticTo> statisticTo) {
        statisticFeign.createAll(statisticTo);
        return "dictionary";
    }
}

