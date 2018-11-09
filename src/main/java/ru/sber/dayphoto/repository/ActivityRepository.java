package ru.sber.dayphoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ru.sber.dayphoto.model.Activity;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Modifying
    @Transactional
    @Query("delete from Activity a where a.id=:id")
    int delete(@Param("id") long id);

//    @Query("select a from Activity a where a.activityGroup.id=:activityGroupId")
    List<Activity> getAllByActivityGroup_Id (long activityGroupId);

}
