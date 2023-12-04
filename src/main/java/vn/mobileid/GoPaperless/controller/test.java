package vn.mobileid.GoPaperless.controller;
import java.time.*;
import java.util.Date;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import static vn.mobileid.GoPaperless.utils.TimeUtils.convertToCurrentTimezone;


public class test {
    public static void main(String[] args) {
        String time = "2023-12-04 09:24:26";
        ZoneId timezone = ZoneId.systemDefault();
//        ZonedDateTime zonedDateTime = convertToCurrentTimezone(time);
        // convert "2023-12-04 09:24:26" to ZonedDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.parse(time, formatter);
        ZonedDateTime zonedDateTime = localDateTime.atZone(ZoneId.systemDefault());
        System.out.println(zonedDateTime.toString());

        // remove [Asia/Bangkok] from ZonedDateTime
        String zonedDateTimeString = zonedDateTime.toString();
        String[] zonedDateTimeStringArray = zonedDateTimeString.split("\\[");
        String zonedDateTimeStringWithoutTimeZone = zonedDateTimeStringArray[0];
        System.out.println(zonedDateTimeStringWithoutTimeZone);

        // convert ZonedDateTime to Timestamp
//        Timestamp timestamp = new Timestamp(Date.from(zonedDateTime.toInstant()).getTime());


//        System.out.println(timezone);
    }
}
