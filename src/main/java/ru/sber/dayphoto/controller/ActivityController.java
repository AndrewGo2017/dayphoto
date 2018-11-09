package ru.sber.dayphoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.Activity;
import ru.sber.dayphoto.model.ActivityGroup;
import ru.sber.dayphoto.service.ActivityGroupService;
import ru.sber.dayphoto.service.ActivityService;

import java.util.List;

@Controller
@RequestMapping("/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivityGroupService activityGroupService;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Активности");
        return "dictionary";
    }

    @GetMapping("/{id}")
    public String get(@PathVariable("id") Integer id, Model m){
        List<ActivityGroup> activityGroups = activityGroupService.getAll();
        Activity activity = activityService.get(id);
        m.addAttribute("activityGroups",activityGroups);
        m.addAttribute("activity",activity);
        return "fragments/dialogs :: activityDialog";
    }

    @PostMapping
    public String save(Activity entity) {
        activityService.save(entity);
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        activityService.delete(id);
        return "dictionary";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<Activity> activities = activityService.getAll();
        m.addAttribute("activities", activities);
        return "fragments/tables :: activityList";
    }
}
