package ru.sber.dayphoto.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;
import ru.sber.dayphoto.model.Activity;
import ru.sber.dayphoto.to.ActivityTo;

import java.util.List;

@Component
@RequestMapping("/context/activity")
@FeignClient(name="photodata", url="${photodata.ribbon.listOfServers}")
public interface ActivityFeign {
    @PostMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void create(ActivityTo activityTo);

    @PutMapping(consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    void update(ActivityTo activityTo);

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    Activity get(@PathVariable("id") long id);

    @DeleteMapping(value = "/{id}")
    boolean delete(@PathVariable("id") long id);

    @GetMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<Activity> getAll();

    @GetMapping(value = "/activityGroup/{id}",produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    List<Activity> getAllByActivityGroupId(@PathVariable("id") long activityGroupId);
}
