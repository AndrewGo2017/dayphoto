package ru.sber.dayphoto.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.ActivityGroup;

import java.util.List;

@RequestMapping("/context/activityGroup")
@FeignClient(name="photodata", url="${photodata.ribbon.listOfServers}")
public interface ActivityGroupFeign {
    @PostMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void create(ActivityGroup activityGroup);

    @PutMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void update(ActivityGroup activityGroup);

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    ActivityGroup get(@PathVariable("id") long id);

    @DeleteMapping(value = "/{id}")
    boolean delete(@PathVariable("id") long id);

    @GetMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<ActivityGroup> getAll();
}
