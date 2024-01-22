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
    private int page;
    private int suffix;
    private String type;
    private String embedded;
    private String processStatus;
    private String processOn;
    private String processBy;
    private Dimension dimension;
    private Boolean visibleEnabled;
    private Boolean required;
    private Boolean read_only;
    private Boolean multiline;
    private Boolean apply_to_all;
    private String renamedAs;
    private String value;
    private String image;
    private String qrToken;
    private String signingToken;
    private List<Integer> initial_pages;
}


