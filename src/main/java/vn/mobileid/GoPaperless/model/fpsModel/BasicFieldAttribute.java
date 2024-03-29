package vn.mobileid.GoPaperless.model.fpsModel;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class BasicFieldAttribute {
    private String fieldName;
    private Integer page;
    private String suffix;
    private Integer maxLength;
    private String type;
    private String embedded;
    private String processStatus;
    private String processOn;
    private String processBy;
    private String placeHolder;
    private Dimension dimension;
    private Boolean visibleEnabled;
    private Boolean required;
    private Boolean read_only;
    private Boolean multiline;
    private Boolean apply_to_all;
    private Boolean replicateAllPages;
    private String renamedAs;
    private String value;
    private String image;
    private String qrToken;
    private String signingToken;
    private String formatType;
    private List<Integer> initial_pages;
    private List<Integer> replicate;
    private AddTextValue font;
    private List<Object> items;
}


