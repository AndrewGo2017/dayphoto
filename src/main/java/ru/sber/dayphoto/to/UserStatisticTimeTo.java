package ru.sber.dayphoto.to;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserStatisticTimeTo {
    private String userName;

    private String activityName;

    private String activityGroupName;

    private LocalTime time;

    public UserStatisticTimeTo(String userName, String activityGroupName, LocalTime time) {
        this.userName = userName;
        this.activityGroupName = activityGroupName;
        this.time = time;
    }
}
