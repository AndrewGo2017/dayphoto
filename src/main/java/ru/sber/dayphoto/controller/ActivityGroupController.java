package ru.sber.dayphoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.ActivityGroup;
import ru.sber.dayphoto.service.ActivityGroupService;

import java.util.List;

@Controller
@RequestMapping("/activityGroup")
public class ActivityGroupController {

    @Autowired
    private ActivityGroupService activityGroupService;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Группы активностей");
        return "dictionary";
    }

    @GetMapping("/{id}")
    public String get(@PathVariable("id") Integer id, Model m){
        ActivityGroup activityGroup = activityGroupService.get(id);
        m.addAttribute("activityGroup",activityGroup);
        return "fragments/dialogs :: activityGroupDialog";
    }

    @PostMapping
    public String save(ActivityGroup entity) {
        activityGroupService.save(entity);
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        activityGroupService.delete(id);
        return "dictionary";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<ActivityGroup> activityGroups = activityGroupService.getAll();
        m.addAttribute("activityGroups", activityGroups);
        return "fragments/tables :: activityGroupList";
    }
}
