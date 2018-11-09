package ru.sber.dayphoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import ru.sber.dayphoto.model.ActivityGroup;

public interface ActivityGroupRepository extends JpaRepository<ActivityGroup, Long> {
    @Modifying
    @Transactional
    @Query("delete from ActivityGroup a where a.id=:id")
    int delete(@Param("id") long id);


}
