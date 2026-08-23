package com.keval.portfolio.config;

import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.concurrent.atomic.AtomicLong;

@Component
@Profile("mongodb")
public class MongoIdGeneratorListener extends AbstractMongoEventListener<Object> {

    private static final AtomicLong counter = new AtomicLong(System.currentTimeMillis() / 1000);

    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event) {
        Object domainObject = event.getSource();
        try {
            Field idField = getIdField(domainObject.getClass());
            if (idField != null) {
                idField.setAccessible(true);
                Object idValue = idField.get(domainObject);
                if (idValue == null && idField.getType().equals(Long.class)) {
                    idField.set(domainObject, counter.incrementAndGet());
                }
            }
        } catch (Exception ignored) {
        }
    }

    private Field getIdField(Class<?> clazz) {
        while (clazz != null && clazz != Object.class) {
            for (Field field : clazz.getDeclaredFields()) {
                if (field.isAnnotationPresent(org.springframework.data.annotation.Id.class)
                        || field.isAnnotationPresent(jakarta.persistence.Id.class)
                        || "id".equalsIgnoreCase(field.getName())) {
                    return field;
                }
            }
            clazz = clazz.getSuperclass();
        }
        return null;
    }
}
