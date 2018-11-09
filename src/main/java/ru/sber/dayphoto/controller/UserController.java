package ru.sber.dayphoto.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.User;
import ru.sber.dayphoto.service.UserService;

import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public String index(Model m){
        m.addAttribute("title", "Пользователи");
        return "dictionary";
    }

    @GetMapping("/{id}")
    public String get(@PathVariable("id") Integer id, Model m){
        User user = userService.get(id);
        m.addAttribute("user",user);
        return "fragments/dialogs :: userDialog";
    }

    @PostMapping
    public String save(User entity) {
         userService.save(entity);
        return "dictionary";
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable("id") Integer id) {
        userService.delete(id);
        return "dictionary";
    }

    @GetMapping("/all")
    public String getAll(Model m){
        List<User> users = userService.getAll();
        m.addAttribute("users", users);
        return "fragments/tables :: userList";
    }
}
