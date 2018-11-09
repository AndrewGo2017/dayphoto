package ru.sber.dayphoto.handler.accordion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.sber.dayphoto.service.ActivityGroupService;
import ru.sber.dayphoto.service.ActivityService;

import java.util.ArrayList;
import java.util.List;

@Component
public class AccordionHandler {
    @Autowired
    private ActivityService activityService;
    
    @Autowired
    private ActivityGroupService activityGroupService; 
    
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

        activityGroupService.getAll().forEach(activityGroup -> {
            Accordion accordion = new Accordion();
            accordion.setNameId(createAccordionName("accordion" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setBodyCardId(createAccordionName("bodyCard" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setCardHeaderId(createAccordionName("cardHeader" ,activityGroup.getId(), activityGroup.getId(), 0));
            accordion.setCardHeaderBtnContent(activityGroup.getName());

            List<AccordionNested> accordionNestedList = new ArrayList<>();

            activityService.getAllByActivityGroupId(activityGroup.getId()).forEach(activity -> {
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

//        AccordionNested accordionNested11 = new AccordionNested(
//                "nameId1-1",
//                "heading1-1",
//                "cardHeaderId1-1",
//                "cardHeaderBtnContent1-1",
//                "bodyCardId1-1",
//                "timer1-1",
//                "current1-1");
//
//        AccordionNested accordionNested12 = new AccordionNested(
//                "nameId1-2",
//                "heading1-2",
//                "cardHeaderId1-2",
//                "cardHeaderBtnContent1-2",
//                "bodyCardId1-2",
//                "timer1-2",
//                "current1-2");
//
//        AccordionNested accordionNested21 = new AccordionNested(
//                "nameId2-1",
//                "heading2-1",
//                "cardHeaderId2-1",
//                "cardHeaderBtnContent2-1",
//                "bodyCardId2-1",
//                "timer2-1",
//                "current2-1");
//
//        AccordionNested accordionNested22 = new AccordionNested(
//                "nameId2-2",
//                "heading2-2",
//                "cardHeaderId2-2",
//                "cardHeaderBtnContent2-2",
//                "bodyCardId2-2",
//                "timer2-2",
//                "current2-2");
//
//
//
//        List<Accordion> list = new ArrayList<>();
//        Accordion a1 = new Accordion("name-1",  "cardHeaderId-1", "cardHeaderBtnContent-1", "bodyCardId-1",  Arrays.asList(accordionNested11, accordionNested12));
//        Accordion a2 = new Accordion("name-2",  "cardHeaderId-2", "cardHeaderBtnContent-2", "bodyCardId-2",  Arrays.asList(accordionNested21, accordionNested22));
//        list.add(a1);
//        list.add(a2);

//        return list;
    }
}
