package ru.sber.dayphoto.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.sber.dayphoto.handler.accordion.Accordion;
import ru.sber.dayphoto.handler.accordion.AccordionHandler;
import ru.sber.dayphoto.model.Statistic;
import ru.sber.dayphoto.model.User;
import ru.sber.dayphoto.service.StatisticService;
import ru.sber.dayphoto.service.UserService;

import java.time.LocalTime;
import java.util.List;

@Controller
@RequestMapping("/index")
public class IndexController {

    @Autowired
    private StatisticService statisticService;

    @Autowired
    private UserService userService;

    @GetMapping
    public String index(Model m) {
        return "index";
    }

    @PostMapping
    public ResponseEntity save(Statistic statistic) {
        statisticService.save(statistic);
        return ResponseEntity.ok("");
    }

    @GetMapping("/fragment/{id}")
    public String getFragment(Model m, @PathVariable("id") Integer id) throws InterruptedException {
        Thread.sleep(300);
        LocalTime totalDayTime = statisticService.getTotalDayTime(id);


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
        List<User> users = userService.getAll();
        m.addAttribute("users", users);
        return "fragments/common :: authDialog";
    }

}

