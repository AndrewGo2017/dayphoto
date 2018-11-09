package ru.sber.dayphoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ru.sber.dayphoto.model.Statistic;
import ru.sber.dayphoto.to.UserStatisticTimeTo;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface StatisticRepository extends JpaRepository<Statistic, Long> {
    @Modifying
    @Transactional
    @Query("delete from Statistic s where s.id=:id")
    int delete(@Param("id") long id);

    @Query("select sum(s.time) from Statistic s where s.user.id=:userId and s.date=:date")
    Optional<LocalTime> getTotalDayTime(@Param("userId") long userId, @Param("date") LocalDate date);

    @Query("select new ru.sber.dayphoto.to.UserStatisticTimeTo(s.user.name , s.activity.activityGroup.name , sum(s.time)) from Statistic s where s.date>=:dateFrom and s.date<=:dateTo group by s.user.name, s.activity.activityGroup.name")
    List<UserStatisticTimeTo> getAllUserTotalDayTime(@Param("dateFrom") LocalDate dateFrom, @Param("dateTo") LocalDate dateTo);

    @Query("select new ru.sber.dayphoto.to.UserStatisticTimeTo(s.user.name , s.activity.name , s.activity.activityGroup.name , sum(s.time)) from Statistic s where s.date>=:dateFrom and s.date<=:dateTo group by s.user.name, s.activity.name, s.activity.activityGroup.name")
    List<UserStatisticTimeTo> getAllUserTotalDayTimeWithActivityDetails(@Param("dateFrom") LocalDate dateFrom, @Param("dateTo") LocalDate dateTo);
}