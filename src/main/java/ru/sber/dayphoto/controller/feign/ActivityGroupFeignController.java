package ru.sber.dayphoto.controller.feign;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.feign.ActivityGroupFeign;
import ru.sber.dayphoto.model.ActivityGroup;

import java.util.List;

@Controller
@RequestMapping("/activityGroup")
public class ActivityGroupFeignController {
    @Autowired
    private ActivityGroupFeign activityGroupFeign;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Группы активностей");
        return "dictionary";
    }

    @GetMapping("/{id}")
    public String get(@PathVariable("id") Integer id, Model m){
        ActivityGroup activityGroup = activityGroupFeign.get(id);
        m.addAttribute("activityGroup",activityGroup);
        return "fragments/dialogs :: activityGroupDialog";
    }

    @PostMapping
    public String save(ActivityGroup activityGroup) {
        if (activityGroup.isNew()){
            activityGroupFeign.create(activityGroup);
        }else {
            activityGroupFeign.update(activityGroup);
        }
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        activityGroupFeign.delete(id);
        return "dictionary";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<ActivityGroup> activityGroups = activityGroupFeign.getAll();
        m.addAttribute("activityGroups", activityGroups);
        return "fragments/tables :: activityGroupList";
    }
}
