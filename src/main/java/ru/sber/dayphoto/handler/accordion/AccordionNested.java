package ru.sber.dayphoto.handler.accordion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AccordionNested{
    private String nameId;
    private String headingNameID;
    private String cardHeaderId;
    private String cardHeaderBtnContent;
    private String bodyCardId;
    private String timerId;
    private String currentId;
}