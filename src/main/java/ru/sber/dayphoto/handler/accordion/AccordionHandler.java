package ru.sber.dayphoto.handler.accordion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.sber.dayphoto.feign.ActivityFeign;
import ru.sber.dayphoto.feign.ActivityGroupFeign;


import java.util.ArrayList;
import java.util.List;

@Component
public class AccordionHandler {
    @Autowired
    private ActivityFeign activityFeign;
    
    @Autowired
    private ActivityGroupFeign activityGroupFeign;
    
    public String createAccordionName(String prefix, long id, long mainLevel, int nestedLevel){
        StringBuilder accordionNameBuilder = new StringBuilder();
        accordionNameBuilder
                .append(prefix)
                .append("-")
                .append(mainLevel)
                .append("-")
                .append(nestedLevel)
                .append("-")
                .append(id);

        return accordionNameBuilder.toString();
    }
    
    
    public List<Accordion> getAccordionList (){

        List<Accordion> accordionList = new ArrayList<>();

        activityGroupFeign.getAll().forEach(activityGroup -> {
            Accordion accordion = new Accordion();
            accordion.setNameId(createAccordionName("accordion" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setBodyCardId(createAccordionName("bodyCard" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setCardHeaderId(createAccordionName("cardHeader" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setCardHeaderBtnContent(activityGroup.getName());

            List<AccordionNested> accordionNestedList = new ArrayList<>();

            activityFeign.getAllByActivityGroupId(activityGroup.getId()).forEach(activity -> {
                AccordionNested accordionNested = new AccordionNested();
                accordionNested.setNameId(createAccordionName("accordionNested" ,activity.getId(), activityGroup.getId(), 1));
                accordionNested.setBodyCardId(createAccordionName("bodyCard" ,activity.getId(), activityGroup.getId(), 1));
                accordionNested.setCardHeaderId(createAccordionName("cardHeader" ,activity.getId(), activityGroup.getId(), 1));
                accordionNested.setCardHeaderBtnContent(activity.getName());
                accordionNested.setHeadingNameID(createAccordionName("heading" ,activity.getId(), activityGroup.getId(), 1));
                accordionNested.setTimerId(createAccordionName("timer" ,activity.getId(), activityGroup.getId(), 1));

                accordionNestedList.add(accordionNested);
            });

            accordion.setAccordionNestedList(accordionNestedList);
            accordionList.add(accordion);
        });

        return accordionList;
    }
}
