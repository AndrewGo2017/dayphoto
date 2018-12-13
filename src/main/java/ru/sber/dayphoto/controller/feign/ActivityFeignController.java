package ru.sber.dayphoto.controller.feign;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.feign.ActivityFeign;
import ru.sber.dayphoto.feign.ActivityGroupFeign;
import ru.sber.dayphoto.model.Activity;
import ru.sber.dayphoto.model.ActivityGroup;
import ru.sber.dayphoto.to.ActivityTo;


import java.util.List;

@Controller
@RequestMapping("/activity")
public class ActivityFeignController {
    @Autowired
    private ActivityFeign activityFeign;

    @Autowired
    private ActivityGroupFeign activityGroupFeign;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Активности");
        return "dictionary";
    }

    @GetMapping("/{id}")
    public String get(@PathVariable("id") Integer id, Model m){
        List<ActivityGroup> activityGroups = activityGroupFeign.getAll();
        Activity activity = activityFeign.get(id);
        m.addAttribute("activityGroups",activityGroups);
        m.addAttribute("activity",activity);
        return "fragments/dialogs :: activityDialog";
    }

    @PostMapping
    public String save(ActivityTo activityTo) {
        if (activityTo.isNew()){
            activityFeign.create(activityTo);
        }else {
            activityFeign.update(activityTo);
        }
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        activityFeign.delete(id);
        return "dictionary";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<Activity> activities = activityFeign.getAll();
        m.addAttribute("activities", activities);
        return "fragments/tables :: activityList";
    }
}
