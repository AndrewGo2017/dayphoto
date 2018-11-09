package ru.sber.dayphoto.handler.accordion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
 public class Accordion{
    private String nameId;
    private String cardHeaderId;
    private String cardHeaderBtnContent;
    private String bodyCardId;
    private List<AccordionNested> accordionNestedList;
}
