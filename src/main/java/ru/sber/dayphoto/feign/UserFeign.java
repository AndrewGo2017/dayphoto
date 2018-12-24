package ru.sber.dayphoto.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.User;
import ru.sber.dayphoto.model.User;

import java.util.List;

@Component
@RequestMapping("/context/user")
@FeignClient(name="photodata", url="${photodata.ribbon.listOfServers}")
public interface UserFeign  {
    @PostMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    User create(User user);

    @PutMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    User update(User user);

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    User get(@PathVariable("id") long id);

    @DeleteMapping(value = "/{id}")
    boolean delete(@PathVariable("id") long id);

    @GetMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<User> getAll();
}
